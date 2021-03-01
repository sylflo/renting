import { rateSchema } from '../../common/validations/seasons_rates'
import { ValidationError } from 'yup'

const seasonRateData = {
  title: 'VERY_LOW_SEASON',
  name: '',
  year: 2020,
  week: 380,
  night: 60,
  weekend: 120,
  minimumDuration: 1,
  color: '#ffff',
}

describe('Season Rate schema validation', () => {
  it('valids season rate schema', async () => {
    await expect(rateSchema.validate(seasonRateData)).resolves.not.toThrow(
      ValidationError,
    )
  })
  it('fails season rate schema when title is not in  ["VERY_LOW_SEASON", "LOW_SEASON", "MIDDLE_SEASON", "HIGH_SEASON"]', async () => {
    try {
      await rateSchema.validate({
        ...seasonRateData,
        title: 'VERY_LOW_SEASONN',
      })
    } catch (e) {
      expect(e.message).toBe(
        'title must be one of the following values: VERY_LOW_SEASON, LOW_SEASON, MIDDLE_SEASON, HIGH_SEASON',
      )
    }
  })
  it('fails when color is not ^#[0-9a-f]{3,6}$/i', async () => {
    try {
      await rateSchema.validate({
        ...seasonRateData,
        color: '#abg',
      })
    } catch (e) {
      expect(e.message).toBe(
        'color must match the following: "/^#[0-9a-f]{3,6}$/i"',
      )
    }
  })
  it('fails season rate schema when week < 0', async () => {
    try {
      await rateSchema.validate({
        ...seasonRateData,
        week: -1,
      })
    } catch (e) {
      expect(e.message).toBe('week must be greater than or equal to 0')
    }
  })
  it('fails season rate schema when night < 0', async () => {
    try {
      await rateSchema.validate({
        ...seasonRateData,
        night: -10,
      })
    } catch (e) {
      expect(e.message).toBe('night must be greater than or equal to 0')
    }
  })
  it('fails season rate schema when weekend < 0', async () => {
    try {
      await rateSchema.validate({
        ...seasonRateData,
        weekend: -42,
      })
    } catch (e) {
      expect(e.message).toBe('weekend must be greater than or equal to 0')
    }
  })
  it('fails season rate schema when minimumDuration < 0', async () => {
    try {
      await rateSchema.validate({
        ...seasonRateData,
        minimumDuration: -2,
      })
    } catch (e) {
      expect(e.message).toBe(
        'minimumDuration must be greater than or equal to 0',
      )
    }
  })
})
