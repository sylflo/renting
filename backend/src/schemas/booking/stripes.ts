import dayjs from 'dayjs'
import Stripe from 'stripe'
import {
  BookingWithCustomer,
  CustomSeasonType,
  DeadlineProductRow,
  DeadlinePaymentRow,
  SeasonWithRate,
  StripeProduct,
} from './types'
import { getSeasonsWithPrices } from './utils'
import stripe from '../../utils/stripe'

const increaseItemQuantity = async (
  season: CustomSeasonType,
  products: StripeProduct,
  product: string,
) => {
  let priceDeposit: Stripe.Price | null = null
  let priceRemaining: Stripe.Price | null = null
  if (!season.rate) {
    return null
  }

  try {
    if (product === 'week') {
      priceDeposit = await stripe().prices.retrieve(
        season.rate.stripePriceIdWeekDeposit as string,
      )
      priceRemaining = await stripe().prices.retrieve(
        season.rate.stripePriceIdWeekRemaining as string,
      )
    }
    if (product === 'weekend') {
      priceDeposit = await stripe().prices.retrieve(
        season.rate.stripePriceIdWeekendDeposit as string,
      )
      priceRemaining = await stripe().prices.retrieve(
        season.rate.stripePriceIdWeekendRemaining as string,
      )
    }
    if (product === 'night') {
      priceDeposit = await stripe().prices.retrieve(
        season.rate.stripePriceIdNightDeposit as string,
      )
      priceRemaining = await stripe().prices.retrieve(
        season.rate.stripePriceIdNightRemaining as string,
      )
    }

    if (!priceDeposit || !priceRemaining) {
      return null
    }

    if (priceDeposit.id in products) {
      products[priceDeposit.id].quantity += 1
      products[priceRemaining.id].quantity += 1
    } else {
      products[priceDeposit.id] = {
        price: priceDeposit,
        deposit: true,
        quantity: 1,
      }
      products[priceRemaining.id] = {
        price: priceRemaining,
        deposit: false,
        quantity: 1,
      }
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

const getBookingProducts = async (
  seasons: SeasonWithRate[],
  startDate: Date,
  endDate: Date,
): Promise<StripeProduct> => {
  const parsedSeasons: CustomSeasonType[] = Object.values(
    getSeasonsWithPrices(seasons, startDate, endDate),
  )

  const products: StripeProduct = {}
  for (const season of parsedSeasons) {
    await increaseItemQuantity(season, products, season.type)
  }

  return products
}

const createStripeInvoice = async (
  items: DeadlineProductRow[],
  booking: BookingWithCustomer,
) => {
  if (!booking.customer.stripeCustomer) {
    throw new Error('Customer was not set on Stripe')
  }
  for (const item of items) {
    await stripe().invoiceItems.create({
      customer: booking.customer?.stripeCustomer,
      price: item.stripePrice.id,
      quantity: item.quantity,
    })
  }
  const invoice = await stripe().invoices.create({
    customer: booking.customer?.stripeCustomer,
    auto_advance: true,
  })
  await stripe().invoices.finalizeInvoice(invoice.id)
  return invoice.id
}

const getPaymentsDeadline = async (
  products: StripeProduct,
  startDate: Date,
): Promise<DeadlinePaymentRow[]> => {
  const deadlines: DeadlinePaymentRow[] = []

  for (const key of Object.keys(products)) {
    if (products[key].deposit) {
      deadlines.push({
        ...products[key],
        stripePrice: await stripe().prices.retrieve(products[key].price.id),
        product: await stripe().products.retrieve(
          products[key].price.product as string,
        ),
        type: 'deposit',
        deadline: dayjs(new Date(startDate))
          .subtract(3 * 30, 'days')
          .format('YYYY/MM/DD'),
      })
    } else {
      deadlines.push({
        ...products[key],
        stripePrice: await stripe().prices.retrieve(products[key].price.id),
        product: await stripe().products.retrieve(
          products[key].price.product as string,
        ),
        type: 'remaining',
        deadline: dayjs(new Date(startDate))
          .subtract(1 * 30, 'days')
          .format('YYYY/MM/DD'),
      })
    }
  }

  // order by deadline
  return deadlines.sort((a, b) => (a.deadline > b.deadline ? 1 : -1))
}

export { getBookingProducts, getPaymentsDeadline, createStripeInvoice }
