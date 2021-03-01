const setToUTCHours = require('../../src/schemas/utils').setToUTCHours
const createSeasonsByDateRange = require('../../src/schemas/season/models').createSeasonsByDateRange
const findOneSeasonRateByName = require('../../src/schemas/seasonRate/models').findOneSeasonRateByName

const createSeasons = async (prisma, titleRate, start, end) => {
  const [startDate, endDate] = setToUTCHours(start, end)

  const rate = await findOneSeasonRateByName(prisma, "2021", titleRate)
  await createSeasonsByDateRange(
    prisma,
    startDate,
    endDate,
    rate.id,
  )
}

exports.createSeasons = createSeasons;
