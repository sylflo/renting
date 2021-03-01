import { nexusPrisma } from 'nexus-plugin-prisma'
import { makeSchema, declarativeWrappingPlugin } from 'nexus'
import { SeasonRate, QuerySeasonRate, MutationSeasonRate } from './seasonRate'
import { Season, MutationSeason, QuerySeason } from './season'
import { Booking, QuerySeasonBooking, MutationSeasonBooking } from './booking'
import { Customer, Address, QueryCustomer, MutationCustomer } from './customer'
import { Product, QueryProduct, MutationProduct } from './products'
import { AuthPayload, me, User, MutationUser } from './users'
import { Amenity, MutationAmenity, QueryAmenity } from './amenity'
import { Activity, MutationActivity, QueryActivity } from './activity'

export const schema = makeSchema({
  types: [
    AuthPayload,
    me,
    User,
    MutationUser,
    QuerySeasonRate,
    QuerySeason,
    MutationSeason,
    MutationSeasonRate,
    SeasonRate,
    Season,
    QuerySeasonBooking,
    Booking,
    MutationSeasonBooking,
    Customer,
    Address,
    QueryCustomer,
    MutationCustomer,
    Product,
    QueryProduct,
    MutationProduct,
    Amenity,
    QueryAmenity,
    MutationAmenity,
    Activity,
    QueryActivity,
    MutationActivity,
  ],
  plugins: [
    declarativeWrappingPlugin(),
    nexusPrisma({
      experimentalCRUD: true,
      shouldGenerateArtifacts: true,
      outputs: {
        typegen: __dirname + '/generated/nexus-plugin-prisma-typegen.d.ts',
      },
    }),
  ],
  shouldGenerateArtifacts: true,
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('../types'),
    export: 'Context',
    alias: 'ctx',
  },
})
