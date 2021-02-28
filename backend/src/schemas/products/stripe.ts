import { ProductStatus } from '@prisma/client'
import Stripe from 'stripe'
import stripe from '../../utils/stripe'

const createPrice = async (
  type: ProductStatus,
  price: number,
): Promise<Stripe.Response<Stripe.Price>> => {
  const product = await stripe().products.create({
    name: type,
  })

  return stripe().prices.create({
    product: product.id,
    unit_amount: price * 100,
    currency: 'eur',
    billing_scheme: 'per_unit',
  })
}

const getProduct = async (priceId: string): Promise<Stripe.Product> => {
  const price = await stripe().prices.retrieve(priceId)
  return stripe().products.retrieve(price.product as string)
}

const updatePrice = async (
  price: number,
  stripePriceId: string,
): Promise<Stripe.Response<Stripe.Price>> => {
  const sripePrice = await stripe().prices.update(stripePriceId, {
    active: false,
  })

  return stripe().prices.create({
    product: sripePrice.product as string,
    unit_amount: price * 100,
    currency: 'eur',
    billing_scheme: 'per_unit',
  })
}

export { createPrice, getProduct, updatePrice }
