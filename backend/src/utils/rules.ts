import { shield, rule } from 'graphql-shield'
import { Context } from '../types'
import { handleError } from '../context'
import { errors } from './constants'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, ctx: Context) => {
      try {
        if (ctx.userId === -1) {
          return handleError(errors.notAuthenticated)
        }
        return true
      } catch (e) {
        return e
      }
    },
  ),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    seasonRates: rules.isAuthenticatedUser,
    seasons: rules.isAuthenticatedUser,
    booking: rules.isAuthenticatedUser,
    bookings: rules.isAuthenticatedUser,
    calculateBooking: rules.isAuthenticatedUser,
    customer: rules.isAuthenticatedUser,
    customers: rules.isAuthenticatedUser,
    product: rules.isAuthenticatedUser,
    products: rules.isAuthenticatedUser,
    amenity: rules.isAuthenticatedUser,
    amenities: rules.isAuthenticatedUser,
    activities: rules.isAuthenticatedUser,
    activity: rules.isAuthenticatedUser,
  },
  Mutation: {
    createSeason: rules.isAuthenticatedUser,
    deleteSeason: rules.isAuthenticatedUser,
    createOneSeasonRate: rules.isAuthenticatedUser,
    updateOneSeasonRate: rules.isAuthenticatedUser,
    deleteOneSeasonRate: rules.isAuthenticatedUser,
    createOneBooking: rules.isAuthenticatedUser,
    changeBookingStatus: rules.isAuthenticatedUser,
    createOneCustomer: rules.isAuthenticatedUser,
    updateOneCustomer: rules.isAuthenticatedUser,
    deleteOneCustomer: rules.isAuthenticatedUser,
    createOneProduct: rules.isAuthenticatedUser,
    updateOneProduct: rules.isAuthenticatedUser,
    createOneAmenity: rules.isAuthenticatedUser,
    updateOneAmenity: rules.isAuthenticatedUser,
    updateManyAmenity: rules.isAuthenticatedUser,
    deleteManyAmenity: rules.isAuthenticatedUser,
    createOneActivity: rules.isAuthenticatedUser,
    updateOneActivity: rules.isAuthenticatedUser,
    updateManyActivity: rules.isAuthenticatedUser,
    deleteManyActivity: rules.isAuthenticatedUser,
  },
})
