import { mutate } from '../utils'
import { prisma } from '../../context'
import { MUTATION_ADD_CUSTOMER as CREATE_CUSTOMER } from '../../common/grapql_schemas/customers'
import { MUTATION_ADD_PRICE as CREATE_RATE } from '../../common/grapql_schemas/season_rates'
import { MUTATION_ADD_SEASON as CREATE_SEASON } from '../../common/grapql_schemas/seasons'
import {
  MUTATION_CREATE_BOOKING as BOOKING_REQUEST,
  MUTATION_BOOKING_STATUS as CHANGE_BOOKING_STATUS,
} from '../../common/grapql_schemas/booking'
import { RATES, SEASONS } from './utils_constants'

const updateBookingStatus = async (oldStatus: any, newStatus: any) => {
  const bookings = await prisma.booking.findMany({})
  await prisma.booking.update({
    where: { id: bookings[0].id },
    data: { status: oldStatus },
  })
  return mutate({
    mutation: CHANGE_BOOKING_STATUS,
    variables: {
      bookingId: bookings[0].id,
      status: newStatus,
    },
  })
}

const createSeasonsAndRates = async () => {
  const result = await mutate({
    mutation: CREATE_CUSTOMER,
    variables: {
      firstName: 'test',
      lastName: 'test',
      email: 'test.test@test.fr',
      phone: '+337451234342',
      language: 'FR',
      line1: '2 rue Emile Zola',
      line2: '',
      postalCode: '75001',
      city: 'Paris',
      country: 'France',
    },
  })
  const rateIds: any = {}
  for (const rate of RATES) {
    const { title, week, night, weekend, minimumDuration } = rate
    const result = await mutate({
      mutation: CREATE_RATE,
      variables: {
        title,
        week,
        night,
        weekend,
        minimumDuration,
        year: 2021,
        color: '#ffff',
      },
    })
    rateIds[result.data.createOneSeasonRate.title] =
      result.data.createOneSeasonRate.id
  }
  // Create seasons
  for (const season of SEASONS) {
    const { titleRate, start, end } = season
    const ret = await mutate({
      mutation: CREATE_SEASON,
      variables: {
        rateId: rateIds[titleRate],
        start,
        end,
      },
    })
  }
}

const createBooking = async (email: string, start: string, end: string) => {
  return mutate({
    mutation: BOOKING_REQUEST,
    variables: {
      start,
      end,
      cleaning: false,
      totalAdults: 2,
      totalKids: 1,
      customerEmail: email,
      message: 'This is a message from the customer',
    },
  })
}

const changeBookingStatus = async (bookingId: number) => {
  return await mutate({
    mutation: CHANGE_BOOKING_STATUS,
    variables: {
      bookingId,
      status: 'ACCEPT',
    },
  })
}

const findFirstBooking = async () => {
  return prisma.booking.findFirst({
    include: {
      customer: {
        include: {
          address: true,
        },
      },
    },
  })
}

export {
  updateBookingStatus,
  createSeasonsAndRates,
  createBooking,
  changeBookingStatus,
  findFirstBooking,
}
