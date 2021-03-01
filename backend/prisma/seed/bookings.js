const faker = require('faker');


const createBookings = (customerIds) => {
  const status = [
    'PENDING_CONFIRMATION',
    'ACCEPTED',
    'DEPOSIT_SENT',
    'REMAINING_BOOKING_SENT',
    'IN_RENTING',
    'RENTING_FINISHED',
    'CANCELLED',
  ]

  const startDate = faker.date.between('2021-01-01', '2021-12-31');
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 16) + 5)

  const bookings = {
    paymentByCard: faker.random.boolean(),
    status: status[Math.floor(Math.random() * status.length)],
    start: startDate,
    end: endDate,
    cleaning: faker.random.boolean(),
    message: faker.lorem.text(),
    totalAdults: faker.random.number(),
    totalKids: faker.random.number(),
    customerId: customerIds[Math.floor(Math.random() * customerIds.length)],
  }

  return bookings;
}

exports.createBookings = createBookings;
