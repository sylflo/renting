import { Season } from '@prisma/client'
import { dateDiffInNights } from '../utils'

const verifyUserInputDates = (
  seasons: Season[],
  startDate: Date,
  endDate: Date,
): void => {
  const totalNights = dateDiffInNights(startDate, endDate) + 1

  seasons = seasons.filter((season: Season) => {
    if (season.date >= startDate && season.date <= endDate) {
      return seasons
    }
  })
  if (seasons.length !== totalNights) {
    throw new Error(
      'Some dates in your date range seem to not be set or having different seasonal price',
    )
  }
  if (!seasons[0].start) {
    throw new Error('The first date has to be the beginning of a season')
  }
  if (!seasons[seasons.length - 1].end) {
    throw new Error('The last date has to be the end of a season')
  }
}

export { verifyUserInputDates }
