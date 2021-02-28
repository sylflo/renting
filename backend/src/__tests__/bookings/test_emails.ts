import { prisma } from '../../context'
import { createBooking, findFirstBooking } from './utils_functions'
import { findSeasonsByDateRange } from '../../schemas/season/models'
import {
  generateDeadlineAndInvoicePdf,
  sendEmail,
} from '../../schemas/booking/emails'
import { getProductsDeadlinePayment } from '../../schemas/booking/utils'
import {
  BookingWithCustomerAddress,
  SeasonWithRate,
} from '../../schemas/booking/types'

beforeAll(async () => {
  await createBooking('test.test@test.fr', '2021-02-20', '2021-02-26')
  const booking = await findFirstBooking()
  const seasons = await findSeasonsByDateRange(
    prisma,
    booking.start,
    booking.end,
    true,
  )
  const otherDeadlines = await getProductsDeadlinePayment(
    prisma,
    new Date(booking.start),
  )
  await generateDeadlineAndInvoicePdf(
    seasons as SeasonWithRate[],
    booking as BookingWithCustomerAddress,
    otherDeadlines,
  )
})

describe('Testing email templates', () => {
  it('it sends an accept email', async () => {
    const booking = await prisma.booking.findFirst({
      include: {
        customer: true,
      },
    })
    await sendEmail(booking, 'ACCEPTED')
  })
})
