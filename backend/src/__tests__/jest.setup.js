import { prisma } from '../context'

jest.setTimeout(60000)

afterAll(async () => {
  await prisma.$disconnect()
})
