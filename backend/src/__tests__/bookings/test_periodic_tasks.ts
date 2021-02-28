import {
  sendDepositTask,
  sendRemainingTask,
  inRentingTask,
  rentingFinishedTask,
} from '../../periodic_tasks/tasks'
import { prisma } from '../../context'
import { findOneBooking, deleteBookingById } from '../../schemas/booking/models'

let bookingId = -1
let customerId = -1

beforeAll(async () => {
  const booking = await prisma.booking.create({
    data: {
      status: 'ACCEPTED',
      paymentByCard: true,
      start: new Date('2021-02-06'),
      end: new Date('2021-02-12'),
      duration: 7,
      totalPrice: 380,
      cleaning: false,
      message: 'This is a test message',
      totalAdults: 1,
      totalKids: 1,
      customer: {
        connect: {
          email: 'test.test@test.fr',
        },
      },
    },
  })
  bookingId = booking.id
  customerId = booking.customerId
})

afterAll(async () => {
  await deleteBookingById(prisma, bookingId)
})

describe('sends the deposit', () => {
  it('accepts a booking', async () => {
    await sendDepositTask()
    const booking = await findOneBooking(prisma, bookingId)
    expect(booking.status).toBe('DEPOSIT_SENT')
  })

  it('sends the remaining of the deposit', async () => {
    await sendRemainingTask()
    const booking = await findOneBooking(prisma, bookingId)
    expect(booking.status).toBe('REMAINING_BOOKING_SENT')
  })

  it('sets the status IN_RENTING', async () => {
    await inRentingTask()
    const booking = await findOneBooking(prisma, bookingId)
    expect(booking.status).toBe('IN_RENTING')
  })

  it('sets the status as FINISHED', async () => {
    await rentingFinishedTask()
    const booking = await findOneBooking(prisma, bookingId)
    expect(booking.status).toBe('RENTING_FINISHED')
  })
})
