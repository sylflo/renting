import Email from 'email-templates'
import util from 'util'
import { exec } from 'child_process'
import { promises as fs } from 'fs'
import pug from 'pug'
import transport from '../../utils/mail'
import { pugToHtml } from '../utils'
import { getBookingProducts, getPaymentsDeadline } from './stripes'
import {
  BookingWithCustomer,
  BookingWithCustomerAddress,
  DeadlineProductRow,
  SeasonWithRate,
} from './types'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

const createEmailInstance = (): Email => {
  return new Email({
    message: {
      from: process.env.SMTP_USER,
    },
    transport,
  })
}

type attachmentType = {
  filename: string
  path: string
}

const sendEmail = async (
  booking: BookingWithCustomer,
  status: string,
): Promise<void> => {
  // status can be ACCEPTED, REFUSED, CANCELLED
  try {
    let attachments: attachmentType[] = []
    if (status === 'ACCEPTED') {
      attachments = [
        {
          filename: 'contract.pdf',
          path: `./files/contracts/contract_${booking.id}.pdf`,
        },
        {
          filename: 'payment_deadlines.pdf',
          path: `./files/booking/${booking.id}/deadline.pdf`,
        },
      ]
    }

    const email = createEmailInstance()
    const ret = await email.send({
      template: `${booking.customer.language.toLowerCase()}/booking-${status.toLowerCase()}`,
      message: {
        to: booking.customer.email,
        attachments,
      },
      locals: {
        booking,
        accepted: status === 'ACCEPTED',
        dateFormat: {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        location: process.env.RENTING_ADDRESS,
        brand_name: process.env.BRAND_NAME,
        icon: process.env.LOGO,
        dayjs,
      },
    })
    return ret
  } catch (e) {
    console.error(e)
    throw e
  }
}

const generateDeadlineAndInvoicePdf = async (
  seasons: SeasonWithRate[],
  booking: BookingWithCustomerAddress,
  productDeadlines: DeadlineProductRow[],
): Promise<boolean> => {
  try {
    const products = await getBookingProducts(
      seasons,
      new Date(booking.start),
      new Date(booking.end),
    )
    const deadlines = await getPaymentsDeadline(products, booking.start)

    await fs.mkdir(`./files/booking/${booking.id}`, { recursive: true })
    const htmlOutput = await pugToHtml(
      `./files/booking/deadlines/invoice.pug`,
      deadlines,
      productDeadlines,
      !booking.totalPrice
        ? 0
        : booking.totalPrice +
            productDeadlines[0].price +
            productDeadlines[1].price,
      booking.customer,
    )

    await fs.writeFile(
      `./files/booking/deadlines/invoice.html`,
      htmlOutput,
      'utf8',
    )
    await util.promisify(exec)(
      `weasyprint file://${process.env.BASE_DIR}/files/booking/deadlines/invoice.html ${process.env.BASE_DIR}/files/booking/${booking.id}/deadline.pdf`,
    )

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const pdfContract = async (booking: BookingWithCustomer): Promise<void> => {
  try {
    const compiledFunction = pug.compileFile(
      `./emails/${booking.customer.language.toLowerCase()}/booking-accepted/contract.pug`,
    )
    const htmltOutput = compiledFunction({
      booking,
      caution: process.env.CAUTION,
      landlord: {
        address: process.env.RENTING_ADDRESS,
        firstName: process.env.LANDLORD_FIRST_NAME,
        lastName: process.env.LANDLORD_LAST_NAME,
        phone: process.env.PHONE,
      },
      dayjs,
    })

    await fs.mkdir('./files/contracts/', { recursive: true })
    const filename = `./files/contracts/contract_${booking.id}.html`
    await fs.writeFile(filename, htmltOutput, 'utf8')

    await util.promisify(exec)(
      `weasyprint file://${process.env.BASE_DIR}/files/contracts/contract_${booking.id}.html ${process.env.BASE_DIR}/files/contracts/contract_${booking.id}.pdf`,
    )
  } catch (e) {
    console.error(e)
  }
}

export { generateDeadlineAndInvoicePdf, sendEmail, pdfContract }
