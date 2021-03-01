import { prisma } from '../context'
import { sendDepositOrRemaining } from './utils'

const sendDepositTask = async (): Promise<void> => {
  const currentDate = new Date()
  await sendDepositOrRemaining(
    new Date(currentDate.setMonth(currentDate.getMonth() + 3)),
    'ACCEPTED',
    'DEPOSIT_SENT',
    'stripeInvoiceDeposit',
    true,
  )
}

const sendRemainingTask = async (): Promise<void> => {
  const currentDate = new Date()
  await sendDepositOrRemaining(
    new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
    'DEPOSIT_SENT',
    'REMAINING_BOOKING_SENT',
    'stripeInvoiceRemaining',
    false,
  )
}

const inRentingTask = async (): Promise<void> => {
  await prisma.booking.updateMany({
    where: {
      paymentByCard: true,
      status: 'REMAINING_BOOKING_SENT',
      start: {
        lte: new Date(),
      },
    },
    data: {
      status: 'IN_RENTING',
    },
  })
}

const rentingFinishedTask = async (): Promise<void> => {
  await prisma.booking.updateMany({
    where: {
      status: 'IN_RENTING',
      end: {
        lte: new Date(),
      },
    },
    data: {
      status: 'RENTING_FINISHED',
    },
  })
}

export {
  sendDepositTask,
  sendRemainingTask,
  inRentingTask,
  rentingFinishedTask,
}
