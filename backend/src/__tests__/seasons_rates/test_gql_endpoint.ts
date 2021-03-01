import { query, mutate } from '../utils'
import { prisma } from '../../context'
import {
  MUTATION_ADD_PRICE as CREATE_SEASON_RATE,
  MUTATION_EDIT_PRICE as UPDATE_SEASON_RATE,
  GET_SEASON_RATE,
  DELETE_SEASON_RATE,
} from '../../common/grapql_schemas/season_rates'

const stripe = require('stripe')(process.env.STRIPE_SK)
let rateId = -1

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Season Rate endpoint', () => {
  it('creates a season rate and new stripe product and price', async () => {
    const res = await mutate({
      mutation: CREATE_SEASON_RATE,
      variables: {
        title: 'VERY_LOW_SEASON',
        year: 2020,
        week: 380,
        night: 60,
        weekend: 120,
        minimumDuration: 1,
        color: '#ffff',
      },
    })

    const priceWeekDeposit = await stripe.prices.retrieve(
      res.data?.createOneSeasonRate.stripePriceIdWeekDeposit,
      {
        expand: ['product'],
      },
    )
    const priceWeekRemaining = await stripe.prices.retrieve(
      res.data?.createOneSeasonRate.stripePriceIdWeekRemaining,
    )
    const productWeek = priceWeekDeposit.product
    expect(productWeek).toMatchObject({
      active: true,
      name: 'VERY_LOW_SEASON 2020 : Week',
      type: 'service',
      unit_label: null,
    })
    expect(priceWeekDeposit).toMatchObject({
      id: res.data?.createOneSeasonRate.stripePriceIdWeekDeposit,
      active: true,
      billing_scheme: 'per_unit',
      currency: 'eur',
      type: 'one_time',
      unit_amount: 11400,
      unit_amount_decimal: '11400',
    })

    const priceWeekendRemaining = await stripe.prices.retrieve(
      res.data?.createOneSeasonRate.stripePriceIdWeekendRemaining,
      {
        expand: ['product'],
      },
    )
    const priceWeekendDeposit = await stripe.prices.retrieve(
      res.data?.createOneSeasonRate.stripePriceIdWeekendDeposit,
    )
    const productWeekend = priceWeekendRemaining.product
    expect(productWeekend).toMatchObject({
      active: true,
      name: 'VERY_LOW_SEASON 2020 : Weekend',
      type: 'service',
      unit_label: null,
    })
    expect(priceWeekendRemaining).toMatchObject({
      id: res.data?.createOneSeasonRate.stripePriceIdWeekendRemaining,
      active: true,
      billing_scheme: 'per_unit',
      currency: 'eur',
      type: 'one_time',
      unit_amount: 8400,
      unit_amount_decimal: '8400',
    })

    const priceNightDeposit = await stripe.prices.retrieve(
      res.data?.createOneSeasonRate.stripePriceIdNightDeposit,
      {
        expand: ['product'],
      },
    )
    const priceNightRemaining = await stripe.prices.retrieve(
      res.data?.createOneSeasonRate.stripePriceIdNightRemaining,
    )
    const productNight = priceNightDeposit.product

    expect(productNight).toMatchObject({
      active: true,
      name: 'VERY_LOW_SEASON 2020 : Night',
      type: 'service',
      unit_label: null,
    })
    expect(priceNightDeposit).toMatchObject({
      id: res.data?.createOneSeasonRate.stripePriceIdNightDeposit,
      active: true,
      billing_scheme: 'per_unit',
      currency: 'eur',
      type: 'one_time',
      unit_amount: 1800,
      unit_amount_decimal: '1800',
    })

    rateId = res.data.createOneSeasonRate.id
    expect(res.data?.createOneSeasonRate).toMatchObject({
      title: 'VERY_LOW_SEASON',
      name: '2020-VERY_LOW_SEASON',
      year: 2020,
      week: 380,
      night: 60,
      weekend: 120,
      minimumDuration: 1,
      color: '#ffff',
      stripePriceIdWeekDeposit: priceWeekDeposit.id,
      stripePriceIdWeekendDeposit: priceWeekendDeposit.id,
      stripePriceIdNightDeposit: priceNightDeposit.id,
      stripePriceIdWeekRemaining: priceWeekRemaining.id,
      stripePriceIdWeekendRemaining: priceWeekendRemaining.id,
      stripePriceIdNightRemaining: priceNightRemaining.id,
    })
  })
  it('updates a season rate by disabling the price and create new one', async () => {
    const res = await mutate({
      mutation: UPDATE_SEASON_RATE,
      variables: {
        id: rateId,
        week: 380,
        night: 50,
        weekend: 100,
        minimumDuration: 1,
        color: '#ffff',
      },
    })

    const priceWeek = await stripe.prices.retrieve(
      res.data?.updateOneSeasonRate.stripePriceIdWeekDeposit,
      {
        expand: ['product'],
      },
    )
    const productWeek = priceWeek.product
    expect(productWeek).toMatchObject({
      active: true,
      name: 'VERY_LOW_SEASON 2020 : Week',
      type: 'service',
      unit_label: null,
    })

    const priceWeekend = await stripe.prices.retrieve(
      res.data?.updateOneSeasonRate.stripePriceIdWeekendDeposit,
      {
        expand: ['product'],
      },
    )
    const productWeekend = priceWeekend.product
    expect(productWeekend).toMatchObject({
      active: true,
      name: 'VERY_LOW_SEASON 2020 : Weekend',
      type: 'service',
      unit_label: null,
    })
    expect(priceWeekend).toMatchObject({
      id: res.data?.updateOneSeasonRate.stripePriceIdWeekendDeposit,
      active: true,
      billing_scheme: 'per_unit',
      currency: 'eur',
      type: 'one_time',
      unit_amount: Math.ceil((30 / 100) * (100 * 100)),
    })

    const priceNight = await stripe.prices.retrieve(
      res.data?.updateOneSeasonRate.stripePriceIdNightDeposit,
      {
        expand: ['product'],
      },
    )
    const productNight = priceNight.product
    expect(productNight).toMatchObject({
      active: true,
      name: 'VERY_LOW_SEASON 2020 : Night',
      type: 'service',
      unit_label: null,
    })
    expect(priceNight).toMatchObject({
      id: res.data?.updateOneSeasonRate.stripePriceIdNightDeposit,
      active: true,
      billing_scheme: 'per_unit',
      currency: 'eur',
      type: 'one_time',
      unit_amount: Math.ceil((30 / 100) * (50 * 100)),
    })

    expect(res.data?.updateOneSeasonRate).toMatchObject({
      title: 'VERY_LOW_SEASON',
      name: '2020-VERY_LOW_SEASON',
      year: 2020,
      week: 380,
      night: 50,
      weekend: 100,
      minimumDuration: 1,
      color: '#ffff',
      stripePriceIdWeekDeposit: priceWeek.id,
      stripePriceIdNightDeposit: priceNight.id,
      stripePriceIdWeekendDeposit: priceWeekend.id,
    })
  })

  it('get the season rate list', async () => {
    const res = await query({ query: GET_SEASON_RATE })
    // const seasonRate = await prisma.seasonRate.findOne({ where: { id: 1 } });
    const seasonRate = await prisma.seasonRate.findUnique({
      where: { id: rateId },
    })
    const stripePriceIdWeekDeposit = await stripe.prices.retrieve(
      seasonRate?.stripePriceIdWeekDeposit,
    )
    const stripePriceIdNightDeposit = await stripe.prices.retrieve(
      seasonRate?.stripePriceIdNightDeposit,
    )
    const stripePriceIdWeekendDeposit = await stripe.prices.retrieve(
      seasonRate?.stripePriceIdWeekendDeposit,
    )
    const stripePriceIdWeekRemaining = await stripe.prices.retrieve(
      seasonRate?.stripePriceIdWeekRemaining,
    )
    const stripePriceIdNightRemaining = await stripe.prices.retrieve(
      seasonRate?.stripePriceIdNightRemaining,
    )
    const stripePriceIdWeekendRemaining = await stripe.prices.retrieve(
      seasonRate?.stripePriceIdWeekendRemaining,
    )

    const rates = res.data?.seasonRates.filter(
      (rate: any) => rate.id === rateId,
    )
    expect(rates[0]).toMatchObject({
      //id: 1,
      id: rateId,
      title: 'VERY_LOW_SEASON',
      name: '2020-VERY_LOW_SEASON',
      year: 2020,
      week: 380,
      night: 50,
      weekend: 100,
      minimumDuration: 1,
      color: '#ffff',
      stripePriceIdWeekDeposit: stripePriceIdWeekDeposit.id,
      stripePriceIdWeekendDeposit: stripePriceIdWeekendDeposit.id,
      stripePriceIdNightDeposit: stripePriceIdNightDeposit.id,
      stripePriceIdWeekRemaining: stripePriceIdWeekRemaining.id,
      stripePriceIdWeekendRemaining: stripePriceIdWeekendRemaining.id,
      stripePriceIdNightRemaining: stripePriceIdNightRemaining.id,
    })
  })

  it('deletes a season rate by disabling price and product on stripe', async () => {
    const res = await mutate({
      mutation: DELETE_SEASON_RATE,
      variables: {
        id: rateId,
      },
    })
    expect(res.data?.deleteOneSeasonRate).toMatchObject({
      title: 'VERY_LOW_SEASON',
      name: '2020-VERY_LOW_SEASON',
      year: 2020,
      week: 380,
      night: 50,
      weekend: 100,
      minimumDuration: 1,
      color: '#ffff',
    })

    const priceWeekDeposit = await stripe.prices.retrieve(
      res.data?.deleteOneSeasonRate.stripePriceIdWeekDeposit,
    )
    const priceWeekendRemaining = await stripe.prices.retrieve(
      res.data?.deleteOneSeasonRate.stripePriceIdWeekendRemaining,
    )
    const priceNightDeposit = await stripe.prices.retrieve(
      res.data?.deleteOneSeasonRate.stripePriceIdNightDeposit,
    )
    expect(priceWeekDeposit.id).toEqual(
      res.data?.deleteOneSeasonRate.stripePriceIdWeekDeposit,
    )
    expect(priceWeekDeposit.active).toEqual(false)
    expect(priceWeekendRemaining.id).toEqual(
      res.data?.deleteOneSeasonRate.stripePriceIdWeekendRemaining,
    )
    expect(priceWeekendRemaining.active).toEqual(false)
    expect(priceNightDeposit.id).toEqual(
      res.data?.deleteOneSeasonRate.stripePriceIdNightDeposit,
    )
    expect(priceNightDeposit.active).toEqual(false)

    const seasonRate = await prisma.seasonRate.findUnique({
      where: { id: rateId },
    })
    expect(seasonRate).toBeNull()
  })
})
