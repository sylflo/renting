import { PrismaClient } from '@prisma/client'
import { SEASONS } from '../src/commands/utils/constants'
import { createAmenities } from './seed/amenities';
import { createActivites } from './seed/activities'
import { createProducts } from './seed/products';
import { createRates } from './seed/rates'
import { createSeasons } from './seed/seasons';
import { createCustomer } from './seed/customers';
import { createBookings } from './seed/bookings';

const prisma = new PrismaClient()

// add customers and add bookings

const addAmenities = async() => {
  const amenities = createAmenities();
  await prisma.amenity.createMany({
    data: amenities,
  })
}

const addActivities = async() => {
  const activites = createActivites('RESTAURANT').concat(createActivites('ACTIVITIES'));
  await prisma.activity.createMany({
    data: activites
  })
}

const addProducts = async() => {
  const products = await createProducts();
  await prisma.product.createMany({
    data: products,
  })
}

const addSeasonRates = async() => {
  const rates = await createRates();
  await prisma.seasonRate.createMany({
    data: rates,
  })
}

const addSeasons = async() => {
  for (const season of SEASONS) {
    const { titleRate, start, end} = season;
    await createSeasons(prisma, titleRate, start, end);
  }
}

const addCustomers = async() => {
  const customerIds: any = []
  for (let i = 0; i < 20; i++) {
    const customers = await createCustomer();
    const customerDb = await prisma.customer.create({
      data: customers,
    })
    customerIds.push(customerDb.id);
  }

  return customerIds;
}

const addBookings = async(customerIds) => {
  for (let i = 0; i < 20; i++) {
    const bookings = await createBookings(customerIds);
    await prisma.booking.create({
      data: bookings,
    })
  }
}

const main = async() => {
  console.log("========= Creating amenities =========")
  await addAmenities()
  console.log("========= Creating activities =========")
  await addActivities()
  console.log("========== Creating products =======");
  await addProducts();
  console.log("========= Creating rates =========")
  await addSeasonRates()
  console.log("========= Creating seasons =========")
  await addSeasons();
  console.log("========= Creating customers =========")
  const customerIds = await addCustomers();
  console.log("========= Creating bookings =========")
  await addBookings(customerIds);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })