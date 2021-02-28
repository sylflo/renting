import { ApolloError, ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import path from 'path'
import i18n from 'i18n'
import * as Sentry from '@sentry/node'
import { permissions } from './utils/rules'
import { isDev } from './utils/constants'
import './utils/config'
import './utils/mail'
import { createContext } from './context'
import { schema } from './schemas/schema'
import './periodic_tasks'

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '../locales'),
})

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

export const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
  playground: true,
  tracing: isDev(),
  introspection: true,
  debug: isDev(),
  cors: true,
  plugins: [
    {
      requestDidStart() {
        return {
          async didEncounterErrors(ctx) {
            // If we couldn't parse the operation, don't
            // do anything here
            if (!ctx.operation) {
              return
            }
            for (const err of ctx.errors) {
              // Only report internal server errors,
              // all errors extending ApolloError should be user-facing
              if (err instanceof ApolloError) {
                continue
              }
              // Add scoped report details and send to Sentry
              Sentry.withScope((scope) => {
                // Annotate whether failing operation was query/mutation/subscription
                if (ctx.operation) {
                  scope.setTag('kind', ctx.operation.operation)
                }
                // Log query and variables as extras
                // (make sure to strip out sensitive data!)
                scope.setExtra('query', ctx.request.query)
                scope.setExtra('variables', ctx.request.variables)
                if (err.path) {
                  // We can also add the path as breadcrumb
                  scope.addBreadcrumb({
                    category: 'query-path',
                    message: err.path.join(' > '),
                    level: Sentry.Severity.Debug,
                  })
                }
                Sentry.captureException(err)
              })
            }
          },
        }
      },
    },
  ],
}).listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-apollo-server#using-the-graphql-api`,
  ),
)
