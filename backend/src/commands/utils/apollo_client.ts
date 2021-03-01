const fetch = require('node-fetch')
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

const globalAny: any = global

globalAny.accessToken = ''

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  fetch,
})

const authLink = setContext((_, { headers }) => {
  const token = globalAny.accessToken
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export { client }
