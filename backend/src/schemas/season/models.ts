import { PrismaClient, SeasonRate, Season } from '@prisma/client'
import { BatchPayload } from './types'

const findSeasonRateById = async (
  prisma: PrismaClient,
  id: number,
): Promise<SeasonRate | null> => {
  return prisma.seasonRate.findUnique({
    where: {
      id,
    },
  })
}

const findSeasonsByRateIdAndDates = async (
  prisma: PrismaClient,
  seasonRateId: number,
  startDate: Date,
  endDate: Date,
): Promise<Season[]> => {
  return prisma.season.findMany({
    where: {
      rate: {
        id: seasonRateId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
}

const countSeasonsByDateRange = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  return prisma.season.count({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })
}

const findSeasonsByDateRange = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
  rate = false,
): Promise<Season[]> => {
  return prisma.season.findMany({
    orderBy: [
      {
        date: 'asc',
      },
    ],
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      rate,
    },
  })
}

const getSeasons = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
): Promise<Season[]> => {
  return prisma.season.findMany({
    include: {
      rate: true,
    },
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
      isBooked: {
        equals: false,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
}

const createSeasonsByDateRange = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
  rateId: number,
): Promise<Season[]> => {
  const current = new Date(startDate)
  const dates: Season[] = []

  while (current <= endDate) {
    dates.push(
      await prisma.season.create({
        data: {
          date: current,
          start: current.getTime() === startDate.getTime() ? true : false,
          end: current.getTime() === endDate.getTime() ? true : false,
          rate: {
            connect: {
              id: rateId,
            },
          },
        },
      }),
    )

    current.setUTCDate(current.getUTCDate() + 1)
  }
  return dates
}

const deleteManySeasons = async (
  prisma: PrismaClient,
  startDate: Date,
  endDate: Date,
): Promise<BatchPayload> => {
  return prisma.season.deleteMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })
}

const updateBookedSeason = async (
  prisma: PrismaClient,
  starDate: Date,
  endDate: Date,
  isBooked: boolean,
): Promise<BatchPayload> => {
  return prisma.season.updateMany({
    where: {
      date: {
        gte: starDate,
        lt: endDate,
      },
    },
    data: {
      isBooked,
    },
  })
}

const findSeasonRateByTitle = async (
  prisma: PrismaClient,
  name: string,
): Promise<SeasonRate | null> => {
  return prisma.seasonRate.findUnique({
    where: {
      name,
    },
  })
}

const findSeasonByRateId = async (
  prisma: PrismaClient,
  rateId: number,
): Promise<Season[]> => {
  return prisma.season.findMany({
    where: {
      seasonRateId: rateId,
    },
  })
}

export {
  getSeasons,
  findSeasonRateById,
  findSeasonsByDateRange,
  createSeasonsByDateRange,
  findSeasonsByRateIdAndDates,
  deleteManySeasons,
  countSeasonsByDateRange,
  updateBookedSeason,
  findSeasonRateByTitle,
  findSeasonByRateId,
}
