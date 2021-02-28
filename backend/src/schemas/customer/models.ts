import { Customer, Prisma, PrismaClient } from '@prisma/client'
import { CustomerWithAddress, CustomerWithBookings } from './types'

const findCustomerByEmail = async (
  prisma: PrismaClient,
  email: string,
): Promise<Customer | null> => {
  return prisma.customer.findUnique({
    where: {
      email,
    },
  })
}

const findCustomerWithBookings = async (
  prisma: PrismaClient,
  where: Prisma.CustomerWhereUniqueInput,
): Promise<CustomerWithBookings | null> => {
  return prisma.customer.findUnique({
    where,
    include: {
      bookings: true,
    },
  })
}

const findCustomerWithAddress = async (
  prisma: PrismaClient,
  where: Prisma.CustomerWhereUniqueInput,
): Promise<CustomerWithAddress | null> => {
  return prisma.customer.findUnique({
    where,
    include: {
      address: true,
    },
  })
}

export {
  findCustomerByEmail,
  findCustomerWithBookings,
  findCustomerWithAddress,
}
