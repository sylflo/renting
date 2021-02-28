import { Customer, Prisma } from '@prisma/client'
import Stripe from 'stripe'
import stripe from '../../utils/stripe'

type CustomerInputWithAddress = Prisma.CustomerCreateInput & {
  address: Prisma.AddressCreateInput
}

const createCustomer = async (
  data: CustomerInputWithAddress,
): Promise<Stripe.Response<Stripe.Customer>> => {
  const { firstName, lastName, email, phone, language, address } = data
  const { postalCode, ...stripeAddress } = address

  return stripe().customers.create({
    name: `${firstName} ${lastName}`,
    email,
    phone,
    preferred_locales: [language],
    address: {
      ...stripeAddress,
      postal_code: address.postalCode,
      line2: !address.line2 ? '' : address.line2,
    },
  })
}

const updateCustomer = async (
  customer: Customer,
  data: CustomerInputWithAddress,
): Promise<Stripe.Response<Stripe.Customer>> => {
  const { firstName, lastName, email, phone, language, address } = data
  const { postalCode, ...stripeAddress } = address
  if (!customer.stripeCustomer) {
    throw new Error(`The customer was not added to Stripe`)
  }

  return stripe().customers.update(customer.stripeCustomer, {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    preferred_locales: [language],
    address: {
      ...stripeAddress,
      postal_code: address.postalCode,
      line2: !address.line2 ? '' : address.line2,
    },
  })
}

export { createCustomer, updateCustomer, CustomerInputWithAddress }
