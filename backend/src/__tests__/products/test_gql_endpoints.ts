import { mutate } from '../utils'
import { prisma } from '../../context'
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
} from '../../common/grapql_schemas/products'

const stripe = require('stripe')(process.env.STRIPE_SK)

afterAll(async () => {
  await prisma.$disconnect()
})

const createProduct = async (status, price: number) => {
  return mutate({
    mutation: CREATE_PRODUCT,
    variables: {
      price,
      status,
    },
  })
}

const updateProduct = async (status, price: number) => {
  return mutate({
    mutation: UPDATE_PRODUCT,
    variables: {
      price,
      status,
    },
  })
}

const checkProduct = async (status, price: number) => {
  const res = await createProduct(status, price)
  const product = res.data.createOneProduct
  expect(product).toMatchObject({
    price,
    status,
  })

  const stripePrice = await stripe.prices.retrieve(product.stripePriceId, {
    expand: ['product'],
  })
  const stripeProduct = stripePrice.product

  expect(stripeProduct).toMatchObject({
    active: true,
    name: status,
    type: 'service',
    unit_label: null,
  })
  expect(stripePrice).toMatchObject({
    id: product.stripePriceId,
    active: true,
    billing_scheme: 'per_unit',
    currency: 'eur',
    type: 'one_time',
    unit_amount: 100 * price,
    unit_amount_decimal: (100 * price).toString(),
  })
}

describe('Testing securtydeposit and cleaning product', () => {
  it('creates the cleaning product', async () => {
    await checkProduct('CLEANING', 100)
  })

  it('creates the security deposit product', async () => {
    await checkProduct('SECURITY_DEPOSIT', 400)
  })

  it('tries to create a new cleaning product', async () => {
    const res = await createProduct('CLEANING', 100)
    expect(res.errors[0].message).toBe(
      'You can only have one product with status CLEANING',
    )
  })

  it('tries to create a new security deposit product', async () => {
    const res = await createProduct('SECURITY_DEPOSIT', 600)
    expect(res.errors[0].message).toBe(
      'You can only have one product with status SECURITY_DEPOSIT',
    )
  })

  it('updates the cleaning product', async () => {
    const res = await updateProduct('CLEANING', 200)
    const product = res.data.updateOneProduct
    const stripePrice = await stripe.prices.retrieve(product.stripePriceId)

    expect(product).toMatchObject({
      price: 200,
      status: 'CLEANING',
    })
    expect(stripePrice).toMatchObject({
      id: product.stripePriceId,
      active: true,
      billing_scheme: 'per_unit',
      currency: 'eur',
      type: 'one_time',
      unit_amount: 100 * 200,
      unit_amount_decimal: (100 * 200).toString(),
    })
  })
})
