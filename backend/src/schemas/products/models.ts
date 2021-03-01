import { PrismaClient, Product, ProductStatus } from '@prisma/client'

const countProductByStatus = async (
  prisma: PrismaClient,
  status: ProductStatus,
): Promise<number> => {
  return prisma.product.count({
    where: {
      status,
    },
  })
}

const findProductByStatus = async (
  prisma: PrismaClient,
  status: ProductStatus,
): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { status },
  })
}

export { countProductByStatus, findProductByStatus }
