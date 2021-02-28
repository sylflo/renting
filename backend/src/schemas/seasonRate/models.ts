import { PrismaClient, SeasonRate } from '@prisma/client'

const findOneSeasonRateByName = async (
  prisma: PrismaClient,
  year: number,
  title: string,
): Promise<SeasonRate | null> => {
  return prisma.seasonRate.findUnique({
    where: {
      name: `${year}-${title}`,
    },
  })
}

const findOneSeasonRateById = async (
  prisma: PrismaClient,
  id: number,
): Promise<SeasonRate | null> => {
  return prisma.seasonRate.findUnique({
    where: {
      id,
    },
  })
}
export { findOneSeasonRateByName, findOneSeasonRateById }
