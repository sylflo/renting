import { arg, core } from 'nexus'
import pug from 'pug'
import dayjs from 'dayjs'
import i18n from 'i18n'
import { CustomerWithAddress } from './customer/types'
import { DeadlinePaymentRow, DeadlineProductRow } from './booking/types'

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const dateTimeArg = (opts: core.NexusArgConfig<'DateTime'>) =>
  arg({ ...opts, type: 'DateTime' })

const dateDiffInNights = (a: Date, b: Date): number => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / _MS_PER_DAY)
}

const diff_months = (dt2: Date, dt1: Date): number => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000
  if (diff < 0) {
    return -1
  }
  diff /= 60 * 60 * 24 * 7 * 4
  return Math.abs(Math.round(diff))
}

const pugToHtml = async (
  filename: string,
  deadlines: DeadlinePaymentRow[],
  otherDeadlines: DeadlineProductRow[],
  totalPrice: number,
  customer: CustomerWithAddress,
): Promise<string | null> => {
  try {
    i18n.setLocale(customer.language.toLowerCase())
    const compiledFunction = pug.compileFile(filename)
    return compiledFunction({
      deadlines,
      otherDeadlines,
      logo: process.env.LOGO,
      brandName: process.env.BRAND_NAME,
      totalPrice,
      customerAddress: customer.address,
      dayjs,
      i18n,
    })
  } catch (e) {
    console.error(e)
    return null
  }
}

const setToUTCHours = (start: Date, end: Date): [Date, Date] => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  startDate.setUTCHours(0, 0, 0, 0)
  endDate.setUTCHours(0, 0, 0, 0)

  return [startDate, endDate]
}

export {
  dateTimeArg,
  dateDiffInNights,
  capitalizeFirstLetter,
  pugToHtml,
  diff_months,
  setToUTCHours,
}
