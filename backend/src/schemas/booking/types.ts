import { Prisma, SeasonRate } from '@prisma/client'
import Stripe from 'stripe'
import { Product as PrismaProduct } from '@prisma/client'

type BookingWithCustomer = Prisma.BookingGetPayload<{
  include: { customer: true }
}>

type BookingWithCustomerAddress = Prisma.BookingGetPayload<{
  include: {
    customer: {
      include: {
        address: true
      }
    }
  }
}>

type SeasonWithRate = Prisma.SeasonGetPayload<{
  include: { rate: true }
}>

enum Product {
  week = 'week',
  weekend = 'weekend',
  night = 'night',
}

type CustomSeasonType = {
  price?: number
  week: boolean
  type: string
  rate?: SeasonRate | null
}

type CustomSeasonObjType = {
  [key: string]: CustomSeasonType
}

type StripeProductValue = {
  price: Stripe.Price
  deposit: boolean
  quantity: number
}

type StripeProduct = {
  [key: string]: StripeProductValue
}

interface DeadlineProductRow extends PrismaProduct {
  stripePrice: Stripe.Price
  product: Stripe.Product
  deadline: string
  quantity: number
  type: string
}

interface DeadlinePaymentRow extends StripeProductValue {
  product: Stripe.Product
  type: string
  deadline: string
  stripePrice: Stripe.Price
}

export {
  BookingWithCustomer,
  BookingWithCustomerAddress,
  SeasonWithRate,
  Product,
  CustomSeasonType,
  CustomSeasonObjType,
  StripeProduct,
  DeadlineProductRow,
  DeadlinePaymentRow,
}
