import { client } from './utils/apollo_client'
import { login } from './utils/login'
import { RATES, SEASONS } from './utils/constants'
import { MUTATION_ADD_PRICE as CREATE_RATE } from '../common/grapql_schemas/season_rates'
import { MUTATION_ADD_SEASON as CREATE_SEASON } from '../common/grapql_schemas/seasons'

const createSeasonsAndRates = async () => {
  const rateIds = {}
  for (const rate of RATES) {
    const { title, week, night, weekend, minimumDuration } = rate
    const result = await client.mutate({
      mutation: CREATE_RATE,
      variables: {
        title,
        year: 2021,
        color: '#ffff',
        week,
        night,
        weekend,
        minimumDuration,
      },
    })
    console.log(`Created rate ${title} for year 2021`)
    rateIds[result.data.createOneSeasonRate.title] =
      result.data.createOneSeasonRate.id
  }
  console.log('All rates created')
  for (const season of SEASONS) {
    const { titleRate, start, end } = season
    const res = await client.mutate({
      mutation: CREATE_SEASON,
      variables: {
        rateId: rateIds[titleRate],
        start,
        end,
      },
    })
    console.log(`Season from ${start} to ${end} created`)
  }
}

const main = async () => {
  try {
    await login()
    console.log('Creating seasons and rates')
    await createSeasonsAndRates()
  } catch (e) {
    console.error(e)
  }
}

main()
  .then(() => {
    console.log('Succeed creating seasons and rates for 2021')
  })
  .catch((e) => {
    console.error(e)
  })
