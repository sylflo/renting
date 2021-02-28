import { objectType, extendType } from 'nexus'
import { rateSchema } from '../../common/validations/seasons_rates'

import { findOneSeasonRateByName, findOneSeasonRateById } from './models'
import {
  createStripePrices,
  deleteSripePrices,
  updateStripePrices,
  StripePricesCreation,
} from './stripe'
import { SeasonRate } from '@prisma/client'

const SeasonRate = objectType({
  name: 'SeasonRate',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.year()
    t.model.name()
    t.model.week()
    t.model.night()
    t.model.weekend()
    t.model.minimumDuration()
    t.model.color()
    t.model.seasons({
      pagination: false,
      filtering: true,
    })
    t.model.stripePriceIdWeekDeposit()
    t.model.stripePriceIdWeekendDeposit()
    t.model.stripePriceIdNightDeposit()
    t.model.stripePriceIdWeekRemaining()
    t.model.stripePriceIdWeekendRemaining()
    t.model.stripePriceIdNightRemaining()
  },
})

const QuerySeasonRate = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.seasonRates()
  },
})

const MutationSeasonRate = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneSeasonRate({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          await rateSchema.validate(args.data)
          const { title, year, week, night, weekend } = args.data

          const rate = await findOneSeasonRateByName(ctx.prisma, year, title)
          if (rate !== null) {
            throw new Error(
              `There is already a rate ${title} for the year ${year}`,
            )
          }
          return originalResolve(
            root,
            {
              ...args,
              data: {
                ...args.data,
                ...(await createStripePrices(
                  week,
                  weekend,
                  night,
                  title,
                  year,
                )),
                name: `${year}-${title}`,
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
    t.crud.updateOneSeasonRate({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          const { week, night, weekend } = args.data
          if (!args.where.id) {
            throw new Error('Id is mandatory')
          }
          const seasonRate = await findOneSeasonRateById(
            ctx.prisma,
            args.where.id,
          )
          if (!seasonRate) {
            throw new Error('Rate was not found')
          }

          const stripePrices: StripePricesCreation = await updateStripePrices(
            week?.set,
            weekend?.set,
            night?.set,
            seasonRate as SeasonRate,
          )
          return originalResolve(
            root,
            {
              ...args,
              data: {
                ...args.data,
                stripePriceIdWeekDeposit: {
                  set: stripePrices.stripePriceIdWeekDeposit,
                },
                stripePriceIdWeekRemaining: {
                  set: stripePrices.stripePriceIdWeekRemaining,
                },
                stripePriceIdWeekendDeposit: {
                  set: stripePrices.stripePriceIdWeekendDeposit,
                },
                stripePriceIdWeekendRemaining: {
                  set: stripePrices.stripePriceIdWeekendRemaining,
                },
                stripePriceIdNightDeposit: {
                  set: stripePrices.stripePriceIdNightDeposit,
                },
                stripePriceIdNightRemaining: {
                  set: stripePrices.stripePriceIdNightRemaining,
                },
                title: { set: seasonRate.title },
                year: { set: seasonRate.year },
                name: { set: seasonRate.name },
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
    t.crud.deleteOneSeasonRate({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          const seasonRate = await originalResolve(root, args, ctx, info)
          await deleteSripePrices(seasonRate as SeasonRate)
          return seasonRate
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
  },
})

export { SeasonRate, QuerySeasonRate, MutationSeasonRate }
