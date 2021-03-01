import { objectType, extendType } from 'nexus'
import {
  updatedCustomerSchema,
  validateFullCustomerSchema,
} from '../../common/validations/customer'
import {
  findCustomerByEmail,
  findCustomerWithBookings,
  findCustomerWithAddress,
} from './models'
import { CustomerWithAddress, CustomerWithBookings } from './types'
import {
  createCustomer as createStripeCustomer,
  updateCustomer as updateStripeCustomer,
} from './stripe'
import { Customer, Prisma } from '@prisma/client'
import stripe from '../../utils/stripe'

const Address = objectType({
  name: 'Address',
  definition(t) {
    t.model.line1()
    t.model.line2()
    t.model.postalCode()
    t.model.city()
    t.model.country()
  },
})

const Customer = objectType({
  name: 'Customer',
  definition(t) {
    t.model.id()
    t.model.firstName()
    t.model.lastName()
    t.model.email()
    t.model.phone()
    t.model.language()
    t.model.stripeCustomer()
    t.model.bookings()
    t.model.address()
  },
})

const QueryCustomer = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.customers(), t.crud.customer()
  },
})

const MutationCustomer = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneCustomer({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          await validateFullCustomerSchema(args.data)
          const { email, address } = args.data
          const customer: Customer | null = await findCustomerByEmail(
            ctx.prisma,
            email,
          )
          if (customer !== null) {
            throw new Error(
              `A customer with the address ${email} already exist`,
            )
          }
          if (!address || !address.create) {
            throw new Error('Please add and address to your customer')
          }
          const stripeCustomer = await createStripeCustomer({
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            email: args.data.email,
            phone: args.data.phone,
            language: args.data.language,
            address: address.create,
          })
          return originalResolve(
            root,
            {
              ...args,
              data: {
                ...args.data,
                stripeCustomer: stripeCustomer.id,
              },
            },
            ctx,
            info,
          )
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
    t.crud.updateOneCustomer({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          await updatedCustomerSchema.validate(args.data)

          const customer: CustomerWithAddress | null = await findCustomerWithAddress(
            ctx.prisma,
            args.where as Prisma.CustomerWhereUniqueInput,
          )
          if (!customer) {
            throw new Error('Customer not found')
          }
          if (!customer.address) {
            throw new Error('Customer address was not set during creation')
          }
          const customerUpdated = await originalResolve(root, args, ctx, info)

          await updateStripeCustomer(customer, {
            firstName: args.data.firstName?.set || customer.firstName,
            lastName: args.data.lastName?.set || customer.lastName,
            email: args.data.email?.set || customer.email,
            phone: args.data.phone?.set || customer.phone,
            language: args.data.language?.set || customer.language,
            address: {
              line1:
                args.data.address?.update?.line1?.set || customer.address.line1,
              line2:
                args.data.address?.update?.line2?.set || customer.address.line2,
              city:
                args.data.address?.update?.city?.set || customer.address.city,
              country:
                args.data.address?.update?.city?.set ||
                customer.address.country,
              postalCode:
                args.data.address?.update?.postalCode?.set ||
                customer.address.postalCode,
            },
          })

          return customerUpdated
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
    t.crud.deleteOneCustomer({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          const customer: CustomerWithBookings | null = await findCustomerWithBookings(
            ctx.prisma,
            args.where as Prisma.CustomerWhereUniqueInput,
          )
          if (!customer) {
            throw new Error('Customer not found')
          }
          if (customer.bookings.length > 0) {
            throw new Error(
              'A customer with associated booking canot be deleted',
            )
          }
          if (!customer.stripeCustomer) {
            throw new Error('Customer was not created in Stripe')
          }
          await stripe().customers.del(customer.stripeCustomer)
          return originalResolve(root, args, ctx, info)
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
  },
})

export { Customer, Address, QueryCustomer, MutationCustomer }
