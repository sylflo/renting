import { mutate } from '../utils'
import { prisma } from '../../context'
import {
  DELETE_SEASON_RATE,
  MUTATION_ADD_PRICE as CREATE_RATE,
} from '../../common/grapql_schemas/season_rates'
import {
  MUTATION_ADD_SEASON as CREATE_SEASON,
  MUTATION_DELETE_SEASON as DELETE_SEASON,
} from '../../common/grapql_schemas/seasons'
import {
  findSeasonRateByTitle,
  findSeasonByRateId,
} from '../../schemas/season/models'

beforeAll(async () => {
  const result = await mutate({
    mutation: CREATE_RATE,
    variables: {
      title: 'LOW_SEASON',
      week: 430,
      night: 65,
      weekend: 150,
      minimumDuration: 2,
      year: 2022,
      color: '#ffff',
    },
  })
  await mutate({
    mutation: CREATE_RATE,
    variables: {
      title: 'HIGH_SEASON',
      week: 800,
      night: 200,
      weekend: 150,
      minimumDuration: 7,
      year: 2022,
      color: '#ffff',
    },
  })
})

afterAll(async () => {
  const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')
  await mutate({
    mutation: DELETE_SEASON_RATE,
    variables: {
      id: rate.id,
    },
  })
  await prisma.$disconnect()
})

describe('it verifies create season endpoint', () => {
  it('creates a new season', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')

    const season = await mutate({
      mutation: CREATE_SEASON,
      variables: {
        rateId: rate.id,
        start: '2022-09-10',
        end: '2022-10-07',
      },
    })
    const seasons = season.data.createSeason
    expect(seasons[0].start).toBe(true)
    expect(seasons[seasons.length - 1].end).toBe(true)
  })

  it('create a new season starting from the begining of the year', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')

    const season = await mutate({
      mutation: CREATE_SEASON,
      variables: {
        rateId: rate.id,
        start: '2022-01-01',
        end: '2022-01-14',
      },
    })
    const seasons = season.data.createSeason
    expect(seasons[0].start).toBe(true)
    expect(seasons[seasons.length - 1].end).toBe(true)
  })

  it('creates a new season ending from the end of the year', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')

    const season = await mutate({
      mutation: CREATE_SEASON,
      variables: {
        rateId: rate.id,
        start: '2022-12-17',
        end: '2022-12-31',
      },
    })
    const seasons = season.data.createSeason
    expect(seasons[0].start).toBe(true)
    expect(seasons[seasons.length - 1].end).toBe(true)
  })
})

describe('it verifies delete season endpoint', () => {
  it('deletes a season', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')

    const season = await mutate({
      mutation: DELETE_SEASON,
      variables: {
        seasonRateId: rate.id,
        start: '2022-09-10',
        end: '2022-10-07',
      },
    })
    expect(season.data.deleteSeason.length).toBe(0)
  })

  it('deletes a season starting from the begining of the year', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')

    const season = await mutate({
      mutation: DELETE_SEASON,
      variables: {
        seasonRateId: rate.id,
        start: '2022-01-01',
        end: '2022-01-14',
      },
    })
    expect(season.data.deleteSeason.length).toBe(0)
  })

  it('deletes a season ending from the end of the year', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-LOW_SEASON')

    const season = await mutate({
      mutation: DELETE_SEASON,
      variables: {
        seasonRateId: rate.id,
        start: '2022-12-17',
        end: '2022-12-31',
      },
    })
    expect(season.data.deleteSeason.length).toBe(0)
  })
})

describe('cascade delete', () => {
  it('creates a new season for HIGH_SEASON rate', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-HIGH_SEASON')
    const season = await mutate({
      mutation: CREATE_SEASON,
      variables: {
        rateId: rate.id,
        start: '2022-07-02',
        end: '2022-07-29',
      },
    })
    const seasons = season.data.createSeason
    expect(seasons[0].start).toBe(true)
    expect(seasons[seasons.length - 1].end).toBe(true)
  })

  it('delete HIGH SEASON rate and should delete its season as well', async () => {
    const rate = await findSeasonRateByTitle(prisma, '2022-HIGH_SEASON')
    await mutate({
      mutation: DELETE_SEASON_RATE,
      variables: {
        id: rate.id,
      },
    })
    const seasons = await findSeasonByRateId(prisma, rate.id)
    const dbRate = await findSeasonByRateId(prisma, rate.id)
    expect(seasons.length).toBe(0)
    expect(dbRate.length).toBe(0)
  })
})
