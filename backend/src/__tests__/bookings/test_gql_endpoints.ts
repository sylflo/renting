import { query, mutate } from '../utils'
import { prisma } from '../../context'
import { isBookingAvailable } from '../../schemas/booking/utils'
import { updateBookingStatus } from './utils_functions'
import {
  CALCULATE_BOOKING,
  MUTATION_CREATE_BOOKING as BOOKING_REQUEST,
  MUTATION_BOOKING_STATUS as CHANGE_BOOKING_STATUS,
} from '../../common/grapql_schemas/booking'

describe('it verifies function used when booking', () => {
  it('checks dates from 2021-01-05 to 2021-01-15 is not booked', async () => {
    const ret = await isBookingAvailable(
      await prisma,
      new Date('2021-01-05'),
      new Date('2021-01-15'),
    )
    expect(ret).toBe(true)
  })

  it('calculates multiple booking price', async () => {
    let price: any = 0

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-07-17',
        end: '2021-07-30',
      },
    })
    expect(price.data.calculateBooking).toBe(1160)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-06-26',
        end: '2021-07-09',
      },
    })
    expect(price.data.calculateBooking).toBe(1160)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-06-12',
        end: '2021-06-25',
      },
    })
    expect(price.data.calculateBooking).toBe(960)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-08-28',
        end: '2021-09-03',
      },
    })
    expect(price.data.calculateBooking).toBe(480)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-07-10',
        end: '2021-07-16',
      },
    })
    expect(price.data.calculateBooking).toBe(580)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-08-07',
        end: '2021-08-13',
      },
    })
    expect(price.data.calculateBooking).toBe(580)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-09-04',
        end: '2021-09-17',
      },
    })
    expect(price.data.calculateBooking).toBe(960)

    price = await query({
      query: CALCULATE_BOOKING,
      variables: {
        start: '2021-05-08',
        end: '2021-06-04',
      },
    })
    expect(price.data.calculateBooking).toBe(1920)
  })
})

describe('Creates a simple booking request', () => {
  it('creates a booking request', async () => {
    // Creates booking request
    const bookingRequest = await mutate({
      mutation: BOOKING_REQUEST,
      variables: {
        start: '2021-01-05',
        end: '2021-01-15',
        cleaning: false,
        totalAdults: 2,
        totalKids: 1,
        customerEmail: 'test.test@test.fr',
        message: 'This is a message from the customer',
      },
    })
    // Verfies booking request
    expect(bookingRequest.data.createOneBooking).toMatchObject({
      status: 'PENDING_CONFIRMATION',
      totalPrice: 760,
      cleaning: false,
      message: 'This is a message from the customer',
      totalAdults: 2,
      totalKids: 1,
    })
    // Admin accepts booking request
    const booking = await mutate({
      mutation: CHANGE_BOOKING_STATUS,
      variables: {
        bookingId: bookingRequest.data.createOneBooking.id,
        status: 'ACCEPT',
      },
    })
  })
})

describe('Request bookings and fail', () => {
  it('fails to create a booking request as customer does not exist', async () => {
    const bookingRequest = await mutate({
      mutation: BOOKING_REQUEST,
      variables: {
        start: '2021-01-03',
        end: '2021-01-25',
        cleaning: false,
        totalAdults: 2,
        totalKids: 1,
        customerEmail: 'customer-does-not-exist@test.fr',
        message: 'This is a message from the customer',
      },
    })
    expect(bookingRequest.errors[0].message).toBe(
      'Customer with email customer-does-not-exist@test.fr does not exist',
    )
  })
  it('tries to accept a booking already cancelled', async () => {
    const booking = await updateBookingStatus('CANCELLED', 'ACCEPT')
    expect(booking.errors[0].message).toEqual(
      'You can not changed a booking which is already cancelled or finished',
    )
  })
  it('tries to cancel a booking already finished', async () => {
    const booking = await updateBookingStatus('RENTING_FINISHED', 'CANCEL')
    expect(booking.errors[0].message).toEqual(
      'You can not changed a booking which is already cancelled or finished',
    )
  })
})
