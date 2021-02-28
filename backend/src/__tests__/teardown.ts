import { DELETE_SEASON_RATE } from '../common/grapql_schemas/season_rates'
import { RATES } from './bookings/utils_constants'
import { prisma } from '../context'
import { mutate } from './utils'
import { MUTATION_DELETE_CUSTOMER_BY_EMAIL } from '../common/grapql_schemas/customers'

const findSeasonRateByTitle = async (name) => {
  return prisma.seasonRate.findUnique({
    where: {
      name,
    },
  })
}

module.exports = async () => {
  await mutate({
    mutation: MUTATION_DELETE_CUSTOMER_BY_EMAIL,
    variables: {
      email: 'test.test@test.fr',
    },
  })
  for (const obj of RATES) {
    const rate = await findSeasonRateByTitle(`2021-${obj.title}`)
    await mutate({
      mutation: DELETE_SEASON_RATE,
      variables: {
        id: rate.id,
      },
    })
  }
  await prisma.$disconnect()
}
