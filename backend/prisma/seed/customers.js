const faker = require('faker');
const createStripeCustomer = require('../../src/schemas/customer/stripe').createCustomer


const createCustomer = async() => {
  const languages = ['fr', 'en'];

  const customer = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber().substring(0, 20),
    language: languages[Math.floor(Math.random() * languages.length)],
    address: {
      create: {
        line1: faker.address.streetName(),
        line2: faker.address.secondaryAddress(),
        postalCode: faker.address.zipCode(),
        city: faker.address.city(),
        country: faker.address.country(),
      }
    }
  }

  const stripeCustomer = await createStripeCustomer({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    language:customer.language,
    address: customer.address.create,
  })


  return {
    ...customer,
    stripeCustomer: stripeCustomer.id,
  };
}

exports.createCustomer = createCustomer
