import { dateDiffInNights } from '../utils'
import { getSeasons } from '../season/models'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import {
  SeasonWithRate,
  CustomSeasonObjType,
  CustomSeasonType,
  DeadlineProductRow,
} from './types'
import { findProductByStatus } from '../products/models'
import stripe from '../../utils/stripe'
import { getProduct } from '../products/stripe'

const isBookingAvailable = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
): Promise<boolean> => {
  const seasons = await getSeasons(prisma, startDate, endDate)
  const totalBookedNights = dateDiffInNights(startDate, endDate) + 1

  if (totalBookedNights !== seasons.length + 1) {
    throw Error(`Date range from ${startDate} to ${endDate} are not bookable`)
  }
  return true
}

// season start from a saturday and finish a Friday
const getSeasonsWithPrices = (
  seasons: SeasonWithRate[],
  startDate: Date,
  endDate: Date,
): CustomSeasonObjType => {
  const totalNights = dateDiffInNights(startDate, endDate)
  const weeks = Math.floor(totalNights / 7)
  let index = 0
  const obj: CustomSeasonObjType = {}

  while (index <= weeks * 7) {
    obj[seasons[index].date.toString()] = {
      price: seasons[index].rate?.week,
      week: true,
      type: 'week',
      ...seasons[index],
    }
    index += 7
  }

  while (index < seasons.length - 1) {
    const rate = seasons[index].rate
    if (rate?.night === 0) {
      throw new Error(
        `You can not book for a day for the season: ${rate.title}`,
      )
    }
    if (
      seasons[index].date.getDay() === 5 ||
      seasons[index].date.getDay() === 6
    ) {
      obj[seasons[index].date.toString()] = {
        price: seasons[index].rate?.weekend,
        week: false,
        type: 'weekend',
        ...seasons[index],
      }
    } else {
      obj[seasons[index].date.toString()] = {
        price: seasons[index].rate?.night,
        type: 'night',
        week: false,
        ...seasons[index],
      }
    }
    index += 1
  }

  return obj
}

const setMaxPrice = (seasonsWithPrices) => {
  const max = {
    week: 0,
    weekend: 0,
    'night:': 0,
  }

  Object.values(seasonsWithPrices).forEach((value: unknown) => {
    const season = value as CustomSeasonType
    if (!season.price) {
      return null
    }
    if (season.price > max[season.type]) {
      max[season.type] = season.price
    }
  })

  return Object.values(seasonsWithPrices).map((value: unknown) => {
    const season = value as CustomSeasonType
    return {
      ...season,
      price: max[season.type],
    }
  })
}

const calculateBookingPrice = (
  seasons: SeasonWithRate[],
  startDate: Date,
  endDate: Date,
): number => {
  const obj: CustomSeasonObjType = getSeasonsWithPrices(
    seasons,
    startDate,
    endDate,
  )
  const seasonWithPrices = setMaxPrice(obj)

  const price = seasonWithPrices
    .map((season: CustomSeasonType) => season.price)
    .reduce((accumulator, price) => {
      if (!accumulator) accumulator = 0
      if (!price) price = 0
      return accumulator + price
    }, 0)

  return price || 0
}

const getProductsDeadlinePayment = async (
  prisma: PrismaClient,
  startDate: Date,
): Promise<DeadlineProductRow[]> => {
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
  const productDeadlines = [
    {
      ...cleaningProduct,
      stripePrice: await stripe().prices.retrieve(
        cleaningProduct.stripePriceId,
      ),
      product: await getProduct(cleaningProduct.stripePriceId),
      deadline: dayjs(new Date(startDate))
        .subtract(1 * 30, 'days')
        .format('YYYY/MM/DD'),
      type: 'cleaning',
      quantity: 1,
    },
    {
      ...securityDepositProduct,
      stripePrice: await stripe().prices.retrieve(
        securityDepositProduct.stripePriceId,
      ),
      product: await getProduct(securityDepositProduct.stripePriceId),
      deadline: dayjs(new Date(startDate))
        .subtract(1 * 30, 'days')
        .format('YYYY/MM/DD'),
      type: 'securityDeposit',
      quantity: 1,
    },
  ]
  return productDeadlines
}

export {
  getSeasonsWithPrices,
  isBookingAvailable,
  calculateBookingPrice,
  getProductsDeadlinePayment,
}
