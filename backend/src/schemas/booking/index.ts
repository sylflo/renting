import { objectType, extendType, stringArg, intArg } from 'nexus'
import { dateTimeArg, setToUTCHours } from '../utils'
import {
  calculateBookingPrice,
  getProductsDeadlinePayment,
  isBookingAvailable,
} from './utils'
import {
  bookingSchema,
  changeBookingStatusSchema,
} from '../../common/validations/bookings'
import { findOneBooking, updateBookingStatusById } from './models'
import { generateDeadlineAndInvoicePdf, pdfContract, sendEmail } from './emails'
import { findSeasonsByDateRange, updateBookedSeason } from '../season/models'
import { findCustomerByEmail } from '../customer/models'
import { BookingWithCustomerAddress, SeasonWithRate } from './types'

const Booking = objectType({
  name: 'Booking',
  definition(t) {
    t.model.id()
    t.model.start()
    t.model.end()
    t.model.duration()
    t.model.totalPrice()
    t.model.cleaning()
    t.model.message()
    t.model.totalAdults()
    t.model.totalKids()
    t.model.paymentByCard()
    t.model.status()
    t.model.customer()
  },
})

const QuerySeasonBooking = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.bookings(),
      t.crud.booking(),
      t.field('calculateBooking', {
        type: 'Int',
        args: {
          start: dateTimeArg({ required: true, type: 'DateTime' }),
          end: dateTimeArg({ required: true, type: 'DateTime' }),
        },
        resolve: async (_, args, ctx) => {
          const { start, end } = args
          const [startDate, endDate] = setToUTCHours(start, end)
          const seasons = await findSeasonsByDateRange(
            ctx.prisma,
            startDate,
            endDate,
            true,
          )
          return await calculateBookingPrice(
            seasons as SeasonWithRate[],
            startDate,
            endDate,
          )
        },
      })
  },
})

const MutationSeasonBooking = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneBooking({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          await bookingSchema.validate(args.data)
          const { start, end, totalAdults, totalKids } = args.data
          const email = args.data.customer.connect?.email
          if (!email) {
            throw new Error('Missing customer email')
          }
          if (!process.env.MAX_PERSONS) {
            throw new Error(
              'Your forgot to set MAX_PERSONS in environment variable',
            )
          }
          if (totalAdults + totalKids > parseInt(process.env.MAX_PERSONS)) {
            throw new Error(
              `This etablishment can only welcome ${process.env.MAX_PERSONS} persons`,
            )
          }
          if ((await findCustomerByEmail(ctx.prisma, email)) === null) {
            throw new Error(`Customer with email ${email} does not exist`)
          }

          const [startDate, endDate] = setToUTCHours(start, end)
          await isBookingAvailable(ctx.prisma, startDate, endDate)
          const seasons = await findSeasonsByDateRange(
            ctx.prisma,
            startDate,
            endDate,
            true,
          )
          return originalResolve(
            root,
            {
              ...args,
              data: {
                ...args.data,
                start: startDate,
                end: endDate,
                duration: seasons.length,
                totalPrice: await calculateBookingPrice(
                  seasons as SeasonWithRate[],
                  startDate,
                  endDate,
                ),
                status: 'PENDING_CONFIRMATION',
              },
            },
            ctx,
            info,
          )
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
    t.field('changeBookingStatus', {
      type: 'Booking',
      args: {
        bookingId: intArg({ required: true }),
        status: stringArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        try {
          await changeBookingStatusSchema.validate(args)

          const { bookingId, status: newStatus } = args
          const booking = await findOneBooking(ctx.prisma, bookingId)
          if (booking === null) {
            throw new Error('Booking not found')
          }
          if (
            booking.status === 'CANCELLED' ||
            booking.status === 'RENTING_FINISHED'
          ) {
            throw new Error(
              'You can not changed a booking which is already cancelled or finished',
            )
          }
          if (
            newStatus === 'ACCEPT' &&
            booking.status !== 'PENDING_CONFIRMATION'
          ) {
            throw new Error('A booking already accepted can only be cancelled')
          }

          const startDate = new Date(booking.start)
          const endDate = new Date(booking.end)
          if (newStatus === 'ACCEPT') {
            await isBookingAvailable(ctx.prisma, startDate, endDate)
            const seasons = await findSeasonsByDateRange(
              ctx.prisma,
              startDate,
              endDate,
              true,
            )

            const productDeadlines = await getProductsDeadlinePayment(
              ctx.prisma,
              startDate,
            )
            await generateDeadlineAndInvoicePdf(
              seasons as SeasonWithRate[],
              booking as BookingWithCustomerAddress,
              productDeadlines,
            )
            await pdfContract(booking)
          }
          if (
            newStatus === 'CANCEL' &&
            booking.status !== 'PENDING_CONFIRMATION'
          ) {
            await sendEmail(booking, 'CANCELLED')
          } else {
            await sendEmail(
              booking,
              newStatus === 'ACCEPT' ? 'ACCEPTED' : 'REFUSED',
            )
          }
          await updateBookedSeason(
            ctx.prisma,
            startDate,
            endDate,
            newStatus === 'ACCEPT' ? true : false,
          )

          return updateBookingStatusById(
            ctx.prisma,
            bookingId,
            newStatus === 'ACCEPT' ? 'ACCEPTED' : 'CANCELLED',
          )
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
  },
})

export { Booking, QuerySeasonBooking, MutationSeasonBooking }
