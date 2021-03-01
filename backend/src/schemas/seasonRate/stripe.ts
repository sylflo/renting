import { SeasonRate } from '@prisma/client'
import Stripe from 'stripe'
import stripe from '../../utils/stripe'
import { StripePricesCreation } from './types'

const createPrice = async (
  product: string,
  price: number,
  deposit: boolean,
): Promise<Stripe.Response<Stripe.Price>> => {
  return stripe().prices.create({
    unit_amount: price,
    currency: 'eur',
    billing_scheme: 'per_unit',
    product: product,
    nickname: deposit ? 'deposit' : 'remaining',
  })
}

const createStripeAndProduct = async (
  title: string,
  year: number,
  priceName: string,
  price: number,
): Promise<[string, string]> => {
  const product = await stripe().products.create({
    name: `${title} ${year} : ${priceName}`,
  })

  const stripePriceDeposit = await createPrice(
    product['id'],
    Math.ceil((30 / 100) * price),
    true,
  )
  const stripePriceRemaining = await createPrice(
    product['id'],
    Math.ceil((70 / 100) * price),
    false,
  )

  return [stripePriceDeposit.id, stripePriceRemaining.id]
}

const createStripePrices = async (
  week: number,
  weekend: number,
  night: number,
  title: string,
  year: number,
): Promise<StripePricesCreation> => {
  const stripePriceIdWeek = await createStripeAndProduct(
    title,
    year,
    'Week',
    week * 100,
  )
  const stripePriceIdWeekend = await createStripeAndProduct(
    title,
    year,
    'Weekend',
    weekend * 100,
  )
  const stripePriceIdNight = await createStripeAndProduct(
    title,
    year,
    'Night',
    night * 100,
  )

  const stripePrices: StripePricesCreation = {
    stripePriceIdWeekDeposit: stripePriceIdWeek[0],
    stripePriceIdWeekRemaining: stripePriceIdWeek[1],
    stripePriceIdWeekendDeposit: stripePriceIdWeekend[0],
    stripePriceIdWeekendRemaining: stripePriceIdWeekend[1],
    stripePriceIdNightDeposit: stripePriceIdNight[0],
    stripePriceIdNightRemaining: stripePriceIdNight[1],
  }

  return stripePrices
}

const updatePrice = async (
  depositPrice: string,
  remainingPrice: string,
  newPrice: number,
): Promise<[string, string]> => {
  const priceDeposit = await stripe().prices.update(depositPrice, {
    active: false,
  })
  await stripe().prices.update(remainingPrice, { active: false })
  const product = await stripe().products.retrieve(
    priceDeposit.product as string,
  )
  const newPriceDeposit = await createPrice(
    product['id'],
    Math.ceil((30 / 100) * (newPrice * 100)),
    true,
  )
  const newPriceRemaining = await createPrice(
    product['id'],
    Math.ceil((70 / 100) * (newPrice * 100)),
    false,
  )
  return [newPriceDeposit.id, newPriceRemaining.id]
}

const updateStripePrices = async (
  week: number | null | undefined,
  weekend: number | null | undefined,
  night: number | null | undefined,
  seasonRate: SeasonRate,
): Promise<StripePricesCreation> => {
  if (
    !seasonRate.stripePriceIdWeekDeposit ||
    !seasonRate.stripePriceIdWeekRemaining ||
    !seasonRate.stripePriceIdWeekendDeposit ||
    !seasonRate.stripePriceIdWeekendRemaining ||
    !seasonRate.stripePriceIdNightDeposit ||
    !seasonRate.stripePriceIdNightRemaining
  ) {
    throw new Error('Rate was not created properly in Stripe')
  }

  let stripePriceIdWeek = ['', '']
  let stripePriceIdWeekend = ['', '']
  let stripePriceIdNight = ['', '']
  if (week) {
    stripePriceIdWeek = await updatePrice(
      seasonRate.stripePriceIdWeekDeposit,
      seasonRate.stripePriceIdWeekRemaining,
      week,
    )
  }
  if (weekend) {
    stripePriceIdWeekend = await updatePrice(
      seasonRate.stripePriceIdWeekendDeposit,
      seasonRate.stripePriceIdWeekendRemaining,
      weekend,
    )
  }
  if (night) {
    stripePriceIdNight = await updatePrice(
      seasonRate.stripePriceIdNightDeposit,
      seasonRate.stripePriceIdNightRemaining,
      night,
    )
  }

  const stripePrices: StripePricesCreation = {
    stripePriceIdWeekDeposit:
      stripePriceIdWeek[0] === ''
        ? seasonRate.stripePriceIdWeekDeposit
        : stripePriceIdWeek[0],
    stripePriceIdWeekRemaining:
      stripePriceIdWeek[0] === ''
        ? seasonRate.stripePriceIdWeekRemaining
        : stripePriceIdWeek[1],
    stripePriceIdWeekendDeposit:
      stripePriceIdWeekend[0] === ''
        ? seasonRate.stripePriceIdWeekendDeposit
        : stripePriceIdWeekend[0],
    stripePriceIdWeekendRemaining:
      stripePriceIdWeekend[0] === ''
        ? seasonRate.stripePriceIdWeekendRemaining
        : stripePriceIdWeekend[1],
    stripePriceIdNightDeposit:
      stripePriceIdNight[0] === ''
        ? seasonRate.stripePriceIdNightDeposit
        : stripePriceIdNight[0],
    stripePriceIdNightRemaining:
      stripePriceIdNight[0] === ''
        ? seasonRate.stripePriceIdNightRemaining
        : stripePriceIdNight[1],
  }

  return stripePrices
}

const deleteSripePrices = async (seasonRate: SeasonRate): Promise<void> => {
  const stripePricesId = [
    seasonRate.stripePriceIdWeekDeposit,
    seasonRate.stripePriceIdWeekendDeposit,
    seasonRate.stripePriceIdNightDeposit,
    seasonRate.stripePriceIdWeekRemaining,
    seasonRate.stripePriceIdWeekendRemaining,
    seasonRate.stripePriceIdNightRemaining,
  ]
  for (const stripePriceId of stripePricesId) {
    if (!stripePriceId) {
      throw new Error('This season rate was not create properly')
    }
    const price = await stripe().prices.update(stripePriceId, {
      active: false,
    })
    await stripe().products.update(price.product as string, {
      active: false,
    })
  }
}

export {
  createStripePrices,
  deleteSripePrices,
  updateStripePrices,
  StripePricesCreation,
}
