import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { client } from './utils/apollo_client'
import { MUTATION_ADD_CUSTOMER } from '../common/grapql_schemas/customers'
import {
  MUTATION_CREATE_BOOKING as BOOKING_REQUEST,
  QUERY_ONE_BOOKING,
  MUTATION_BOOKING_STATUS,
} from '../common/grapql_schemas/booking'
import { login } from './utils/login'

const prisma = new PrismaClient()

async function createBookingRequest(start, end, paymentByCard, customerEmail) {
  let res = await client.mutate({
    mutation: BOOKING_REQUEST,
    variables: {
      start,
      end,
      cleaning: true,
      message: '',
      totalAdults: 0,
      totalKids: 0,
      customerEmail,
      paymentByCard,
    },
  })

  const bookingId = res.data.createOneBooking.id
  res = await client.query({
    query: QUERY_ONE_BOOKING,
    variables: {
      id: bookingId,
    },
  })
  const booking = res.data.booking
  console.log(booking)
  if (new Date(booking.end) <= new Date()) {
    console.log(
      `Setting booking with id ${bookingId} status to RENTING_FINISHED`,
    )
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: {
          set: 'RENTING_FINISHED',
        },
      },
    })
  } else {
    await client.mutate({
      mutation: MUTATION_BOOKING_STATUS,
      variables: {
        bookingId,
        status: 'ACCEPT',
      },
    })
  }
}

async function createOneCustomer(customer) {
  const res = await client.mutate({
    mutation: MUTATION_ADD_CUSTOMER,
    variables: {
      ...customer,
      ...customer.address,
    },
  })
  return res.data.createOneCustomer
}

async function main() {
  if (process.argv.length !== 3) {
    console.error('Usage  node ./backend/src/commands/booking.js jsonFile')
    process.exit(-1)
  }

  const args = process.argv.slice(2)
  const rawdata = fs.readFileSync(args[0], 'utf-8')
  const BOOKINGS = JSON.parse(rawdata)
  console.log(BOOKINGS)
  await login()
  for (const booking of BOOKINGS) {
    const {
      customer: { email },
    } = booking
    const customer = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    })
    if (customer === null) {
      await createOneCustomer(booking.customer)
    }
    await createBookingRequest(
      booking.start,
      booking.end,
      booking.paymentByCard,
      booking.customer.email,
    )
    console.log(
      `Booking from ${booking.start} to ${booking.end} for customer ${booking.customer.email} has been created`,
    )
  }
  await prisma.$disconnect()
}

main()
  .then(() => {
    console.log('Succeed: Bookings created')
  })
  .catch((e) => {
    console.error(e)
  })
