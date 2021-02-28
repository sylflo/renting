import Queue from 'bull'
import {
  sendDepositTask,
  sendRemainingTask,
  inRentingTask,
  rentingFinishedTask,
} from './tasks'

const REDIS_URL = process.env.REDIS_URL as string

const sendDepositQueue = new Queue('send Deposit Queue', REDIS_URL)
const sendRemainingQueue = new Queue('send Remaining Queue', REDIS_URL)
const bookingInRentingQueue = new Queue(
  'set booking status IN_RENTING',
  REDIS_URL,
)
const bookingFinishedQueue = new Queue(
  'set booking status RENTING_FINISHED',
  REDIS_URL,
)

sendDepositQueue.process(async function () {
  try {
    await sendDepositTask()
  } catch (e) {
    console.error(e)
  }
})

sendRemainingQueue.process(async function () {
  try {
    await sendRemainingTask()
  } catch (e) {
    console.error(e)
  }
})

bookingInRentingQueue.process(async function () {
  await inRentingTask()
})

bookingFinishedQueue.process(async function () {
  await rentingFinishedTask()
})

// Add Queue
const cron = '* * * * *'
sendDepositQueue.add({}, { repeat: { cron } })
sendRemainingQueue.add({}, { repeat: { cron } })
bookingInRentingQueue.add({}, { repeat: { cron } })
bookingFinishedQueue.add({}, { repeat: { cron } })
