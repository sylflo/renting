import { seasonSchema } from '../../common/validations/seasons'

describe('it verifies season schema', () => {
  it('fails when trying to create a season starting from a friday', async () => {
    try {
      const res = await seasonSchema.validate({
        seasonRateId: 42,
        start: '2021-01-08',
        end: '2021-01-15',
      })
    } catch (e) {
      expect(e.message).toBe(
        'A season can either start from a saturday or the beginning of a year',
      )
    }
  })
  it('succeed when creating a season starting from a saturday', async () => {
    const res = await seasonSchema.validate({
      seasonRateId: 42,
      start: '2021-01-09',
      end: '2021-01-15',
    })
    expect(res).toMatchObject({
      seasonRateId: 42,
      start: '2021-01-09',
      end: '2021-01-15',
    })
  })
  it('succeed when creating a season starting from the first day of a year', async () => {
    const res = await seasonSchema.validate({
      seasonRateId: 42,
      start: '2021-01-01',
      end: '2021-01-15',
    })
    expect(res).toMatchObject({
      seasonRateId: 42,
      start: '2021-01-01',
      end: '2021-01-15',
    })
  })
  it('fails when trying to create a season ending from a saturday', async () => {
    try {
      const res = await seasonSchema.validate({
        seasonRateId: 42,
        start: '2021-01-09',
        end: '2021-01-16',
      })
    } catch (e) {
      expect(e.message).toBe(
        'A season can either end from a friday or the end of a year',
      )
    }
  })
  it('succeed when creating a season ending from a friday', async () => {
    const res = await seasonSchema.validate({
      seasonRateId: 42,
      start: '2021-01-09',
      end: '2021-01-15',
    })
    expect(res).toMatchObject({
      seasonRateId: 42,
      start: '2021-01-09',
      end: '2021-01-15',
    })
  })
  it('succeed when creating a season ending from the last day of a year', async () => {
    const res = await seasonSchema.validate({
      seasonRateId: 42,
      start: '2021-01-09',
      end: '2021-12-31',
    })
    expect(res).toMatchObject({
      seasonRateId: 42,
      start: '2021-01-09',
      end: '2021-12-31',
    })
  })
})
