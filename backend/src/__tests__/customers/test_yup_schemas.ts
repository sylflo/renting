import { validateFullCustomerSchema } from '../../common/validations/customer'

import { ValidationError } from 'yup'

const customerData = {
  email: 'test@test.fr',
  firstName: 'Sylvain',
  lastName: 'Chateau',
  phone: '+33782456578',
  language: 'FR',
  address: {
    create: {
      line1: '2 rue Emile Zola',
      postalCode: '75001',
      city: 'Paris',
      country: 'France',
    },
  },
}

describe('Customer schema validation', () => {
  it('valids customer schema', async () => {
    await expect(validateFullCustomerSchema(customerData)).resolves.not.toThrow(
      ValidationError,
    )
  })
  it('invalids customer schema: missing email address', async () => {
    const { email, ...rest } = customerData
    try {
      await validateFullCustomerSchema(rest)
    } catch (e) {
      expect(e.message).toBe('email is a required field')
    }
  })
  it('invalids customer schema: wrong format for email address', async () => {
    try {
      await validateFullCustomerSchema({ ...customerData, email: 'test' })
    } catch (e) {
      expect(e.message).toBe('email must be a valid email')
    }
  })
  it('invalids customer schema: wrong format for language', async () => {
    try {
      await validateFullCustomerSchema({ ...customerData, language: 'english' })
    } catch (e) {
      expect(e.message).toBe(
        'language must be one of the following values: FR, EN',
      )
    }
  })
  it('invalid customer schema: no address create field', async () => {
    try {
      const { address, ...rest } = customerData
      await validateFullCustomerSchema(rest)
    } catch (e) {
      expect(e.message).toBe('address.create.country is a required field')
    }
  })
})
