import Stripe from 'stripe'

const stripe = (): Stripe => {
  if (!process.env.STRIPE_SK) {
    throw new Error('STRIPE_SK is not set in your environment variable')
  }
  return new Stripe(process.env.STRIPE_SK, {
    apiVersion: '2020-08-27',
  })
}

export default stripe
