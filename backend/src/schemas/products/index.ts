import { objectType, extendType } from 'nexus'
import { countProductByStatus, findProductByStatus } from './models'
import {
  createPrice as createStripePrice,
  updatePrice as updateStripePrice,
} from './stripe'
import { productSchema } from '../../common/validations/products'

const Product = objectType({
  name: 'Product',
  definition(t) {
    t.model.id()
    t.model.price()
    t.model.status()
    t.model.stripePriceId()
  },
})

const QueryProduct = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.product()
    t.crud.products()
  },
})

const MutationProduct = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneProduct({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          await productSchema.validate(args.data)
          const { status, price } = args.data

          const nbProduct = await countProductByStatus(ctx.prisma, status)
          if (nbProduct === 1) {
            throw Error(`You can only have one product with status ${status}`)
          }
          const stripePrice = await createStripePrice(status, price)
          args.data['stripePriceId'] = stripePrice.id

          return originalResolve(root, args, ctx, info)
        } catch (e) {
          console.error(e)
          throw e
        }
      },
    })
    t.crud.updateOneProduct({
      async resolve(root, args, ctx, info, originalResolve) {
        try {
          if (!args.data.status?.set || !args.data.price?.set) {
            throw new Error('Status and price are mandatory')
          }
          const product = await findProductByStatus(
            ctx.prisma,
            args.data.status.set,
          )
          if (!product?.stripePriceId) {
            throw new Error('Product was not added to Stripe')
          }

          const stripePrice = await updateStripePrice(
            args.data.price.set,
            product.stripePriceId,
          )

          return await originalResolve(
            root,
            {
              ...args,
              data: {
                ...args.data,
                stripePriceId: {
                  set: stripePrice.id,
                },
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
  },
})

export { Product, QueryProduct, MutationProduct }
