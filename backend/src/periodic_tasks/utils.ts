import { prisma } from '../context'
import { findSeasonsByDateRange } from '../schemas/season/models'
import { SeasonWithRate } from '../schemas/booking/types'
import {
  findBookingsByStatusAndDeadline,
  updateBookingsStripeId,
} from '../schemas/booking/models'
import {
  createStripeInvoice,
  getBookingProducts,
  getPaymentsDeadline,
} from '../schemas/booking/stripes'
import { findProductByStatus } from '../schemas/products/models'
import { getProduct } from '../schemas/products/stripe'
import stripe from '../utils/stripe'
import { BookingStatus } from '@prisma/client'

const sendDepositOrRemaining = async (
  deadline: Date,
  oldStatus: BookingStatus,
  newStatus: BookingStatus,
  invoiceType: string,
  deposit: boolean,
): Promise<void> => {
  const bookings = await findBookingsByStatusAndDeadline(
    prisma,
    oldStatus,
    deadline,
  )

  for (const booking of bookings) {
    const startDate = new Date(booking.start)
    const endDate = new Date(booking.end)
    endDate.setDate(endDate.getDate() - 1)

    const seasons = await findSeasonsByDateRange(
      prisma,
      startDate,
      endDate,
      true,
    )
    const products = await getBookingProducts(
      seasons as SeasonWithRate[],
      new Date(booking.start),
      new Date(booking.end),
    )
    const deadlines = await getPaymentsDeadline(products, booking.start)
    const filtered = deposit
      ? deadlines.filter((deadline) => deadline.deposit)
      : deadlines.filter((deadline) => !deadline.deposit)
    if (!deposit) {
      const cleaningProduct = await findProductByStatus(prisma, 'CLEANING')
      const securityDepositProduct = await findProductByStatus(
        prisma,
        'SECURITY_DEPOSIT',
      )
      if (
        !cleaningProduct ||
        !cleaningProduct.stripePriceId ||
        !securityDepositProduct ||
        !securityDepositProduct.stripePriceId
      ) {
        throw new Error('Cleaning and security product have to be configured')
      }
      filtered.push({
        quantity: 1,
        price: await stripe().prices.retrieve(cleaningProduct.stripePriceId),
        product: await getProduct(cleaningProduct.stripePriceId),
        type: 'cleaning',
        deposit: false,
        deadline: '',
        stripePrice: await stripe().prices.retrieve(
          cleaningProduct.stripePriceId,
        ),
      })
      filtered.push({
        quantity: 1,
        price: await stripe().prices.retrieve(
          securityDepositProduct.stripePriceId,
        ),
        product: await getProduct(securityDepositProduct.stripePriceId),
        type: 'security-deposit',
        deposit: false,
        deadline: '',
        stripePrice: await stripe().prices.retrieve(
          cleaningProduct.stripePriceId,
        ),
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoiceId = await createStripeInvoice(filtered as any, booking)

    await updateBookingsStripeId(
      prisma,
      booking.id,
      newStatus,
      invoiceType,
      invoiceId,
    )
  }
}

export {
  findBookingsByStatusAndDeadline,
  updateBookingsStripeId,
  sendDepositOrRemaining,
}
