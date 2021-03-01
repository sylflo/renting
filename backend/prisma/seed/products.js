const createPrice = require('../../src/schemas/products/stripe').createPrice

const createProducts = async() => {
  const securityDepositPrice = await createPrice('SECURITY_DEPOSIT', 400);
  const cleaningPrice = await createPrice('CLEANING', 100);
  return [
    {
      status: 'SECURITY_DEPOSIT',
      price: 400,
      stripePriceId: securityDepositPrice.id,
    },
    {
      status: 'CLEANING',
      price: 100,
      stripePriceId: cleaningPrice.id

    }
  ]
}

exports.createProducts = createProducts;
