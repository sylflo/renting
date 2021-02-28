import { Booking, BookingStatus, PrismaClient } from '@prisma/client'
import { BookingWithCustomer } from './types'

const findOneBooking = async (
  prisma: PrismaClient,
  bookingId: number,
): Promise<BookingWithCustomer | null> => {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: {
        include: {
          address: true,
        },
      },
    },
  })
}

const updateBookingStatusById = async (
  prisma: PrismaClient,
  bookingId: number,
  status: BookingStatus,
): Promise<Booking | null> => {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
    },
    include: {
      customer: {
        include: {
          address: true,
        },
      },
    },
  })
}

const findBookingsByStatusAndDeadline = async (
  prisma: PrismaClient,
  status: BookingStatus,
  deadline: Date,
): Promise<BookingWithCustomer[]> => {
  return prisma.booking.findMany({
    where: {
      paymentByCard: true,
      status,
      start: {
        lte: deadline,
      },
    },
    include: {
      customer: true,
    },
  })
}

const updateBookingsStripeId = async (
  prisma: PrismaClient,
  id: number,
  status: BookingStatus,
  invoiceType: string,
  invoiceId: string,
): Promise<Booking | null> => {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      status,
      [invoiceType]: invoiceId,
    },
  })
}

const deleteBookingById = async (
  prisma: PrismaClient,
  bookingId: number,
): Promise<Booking | null> => {
  return prisma.booking.delete({
    where: {
      id: bookingId,
    },
  })
}

export {
  findOneBooking,
  updateBookingStatusById,
  findBookingsByStatusAndDeadline,
  updateBookingsStripeId,
  deleteBookingById,
}
