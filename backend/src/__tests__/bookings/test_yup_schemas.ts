import { ValidationError } from 'yup'
import {
  bookingSchema,
  changeBookingStatusSchema,
} from '../../common/validations/bookings'

const bookingRequestData = {
  start: '2021-02-01',
  end: '2021-04-30',
  totalAdults: 2,
  totalKids: 1,
  cleaning: false,
  message: 'This is a message',
  customer: {
    connect: {
      email: 'test@test.com',
    },
  },
}

describe('Booking request schema validation', () => {
  it('fails to valid schema as customer is not present', async () => {
    try {
      const { customer, ...noCustomer } = bookingRequestData
      const res = await bookingSchema.validate(noCustomer)
    } catch (e) {
      expect(e.message).toBe('customer.connect.email is a required field')
    }
  })
  it('fails to valid schema when totalAdults < 0', async () => {
    try {
      await bookingSchema.validate({
        ...bookingRequestData,
        totalAdults: -1,
      })
    } catch (e) {
      expect(e.message).toBe('totalAdults must be greater than or equal to 0')
    }
  })
  it('fails to valid schema when totalKids < 0', async () => {
    try {
      await bookingSchema.validate({
        ...bookingRequestData,
        totalKids: -1,
      })
    } catch (e) {
      expect(e.message).toBe('totalKids must be greater than or equal to 0')
    }
  })
})

const bookingAcceptData = {
  bookingId: 1,
  status: 'ACCEPT',
}
describe('Accept booking schema validation', () => {
  it('invalids a wrong status', async () => {
    try {
      await changeBookingStatusSchema.validate({
        ...bookingAcceptData,
        status: 'WRONG_STRING',
      })
    } catch (e) {
      expect(e.message).toBe(
        'status must be one of the following values: ACCEPT, CANCEL',
      )
    }
  })
  it('valids a correct status', async () => {
    await expect(
      changeBookingStatusSchema.validate(bookingAcceptData),
    ).resolves.not.toThrow(ValidationError)
  })
})
