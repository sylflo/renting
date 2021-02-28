import { objectType, extendType, intArg } from 'nexus'
import { Season } from '@prisma/client'
import { dateTimeArg, setToUTCHours } from '../utils'
import { seasonSchema } from '../../common/validations/seasons'
import {
  findSeasonRateById,
  countSeasonsByDateRange,
  createSeasonsByDateRange,
  findSeasonsByRateIdAndDates,
  deleteManySeasons,
} from './models'
import { verifyUserInputDates } from './utils'

const Season = objectType({
  name: 'Season',
  definition(t) {
    t.model.id()
    t.model.date()
    t.model.start()
    t.model.end()
    t.model.seasonRateId()
    t.model.rate()
    t.model.isBooked()
  },
})

const QuerySeason = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.seasons({
      async resolve(root, args, ctx) {
        return ctx.prisma.season.findMany({
          orderBy: [
            {
              date: 'asc',
            },
          ],
        })
      },
    })
  },
})

const MutationSeason = extendType({
  type: 'Mutation',
  definition(t) {
    t.list.field('createSeason', {
      type: 'Season',
      args: {
        seasonRateId: intArg({ required: true }),
        start: dateTimeArg({ required: true, type: 'DateTime' }),
        end: dateTimeArg({ required: true, type: 'DateTime' }),
      },
      resolve: async (_, args, ctx) => {
        try {
          await seasonSchema.validate(args)
          const { seasonRateId, start, end } = args
          const [startDate, endDate] = setToUTCHours(start, end)
          if (startDate >= endDate) {
            throw new Error('Start date must be inferior to end date')
          }
          const rate = await findSeasonRateById(ctx.prisma, seasonRateId)
          if (rate == null) {
            throw new Error(`This seasonal rate does not exist`)
          }
          if (
            (await countSeasonsByDateRange(ctx.prisma, startDate, endDate)) !==
            0
          ) {
            throw new Error('Some of the dates are already in use')
          }
          return createSeasonsByDateRange(
            ctx.prisma,
            startDate,
            endDate,
            rate.id,
          )
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    }),
      t.list.field('deleteSeason', {
        type: 'Season',
        args: {
          seasonRateId: intArg({ required: true }),
          start: dateTimeArg({ required: true, type: 'DateTime' }),
          end: dateTimeArg({ required: true, type: 'DateTime' }),
        },
        resolve: async (_, args, ctx) => {
          try {
            await seasonSchema.validate(args)
            const { seasonRateId, start, end } = args
            const [startDate, endDate] = setToUTCHours(start, end)

            const seasons = await findSeasonsByRateIdAndDates(
              ctx.prisma,
              seasonRateId,
              startDate,
              endDate,
            )
            verifyUserInputDates(seasons as Season[], startDate, endDate)
            await deleteManySeasons(ctx.prisma, startDate, endDate)
            return []
          } catch (e) {
            console.error(e)
            throw e
          }
        },
      })
  },
})

export { Season, MutationSeason, QuerySeason }
