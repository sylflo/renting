import { client } from './apollo_client'
import { MUTATION_LOGIN } from '../../common/grapql_schemas/admin'

const globalAny: any = global

const getLoginInfo = () => {
  if (!process.env.EMAIL || !process.env.PASSWORD) {
    throw new Error(
      `You need to set EMAIL and PASSWORD in you environment variable\n or EMAIL="yourEmail" PASSWORD="yourPassword" command params`,
    )
  }
  return {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  }
}

const login = async () => {
  const { email, password } = getLoginInfo()
  const res = await client.mutate({
    mutation: MUTATION_LOGIN,
    variables: {
      email,
      password,
    },
  })
  globalAny.accessToken = res.data.login.accessToken
  return res
}

export { login }
