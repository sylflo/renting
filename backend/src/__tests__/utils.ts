import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server'
import path from 'path'
import i18n from 'i18n'
import '../utils/config'
import '../utils/mail'
import { schema } from '../schemas/schema'
import { createContext } from '../context'

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '../../locales/'),
})

const server = new ApolloServer({
  schema,
  context: createContext,
  playground: true,
  tracing: true,
  introspection: true,
  debug: true,
  cors: true,
})
const { query, mutate } = createTestClient(server)

export { server, query, mutate, createContext }
