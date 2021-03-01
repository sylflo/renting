import { productSchema } from '../../common/validations/products'

describe('it verifies product schema', () => {
  it('fails when trying to create a product schema with a negative price', async () => {
    try {
      await productSchema.validate({
        price: -1,
        status: 'SECURITY_DEPOSIT',
      })
    } catch (e) {
      expect(e.message).toBe('price must be greater than or equal to 0')
    }
  })

  it('fails when trying to create a product with an invalid status', async () => {
    try {
      await productSchema.validate({
        price: 100,
        status: 'WRONG_STATUS',
      })
    } catch (e) {
      expect(e.message).toBe(
        'status must be one of the following values: SECURITY_DEPOSIT, CLEANING',
      )
    }
  })
})
