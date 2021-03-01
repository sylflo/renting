const RATES = require('../../src/commands/utils/constants').RATES
const createStripePrices = require('../../src/schemas/seasonRate/stripe').createStripePrices

const createRates = async() => {
  const year = 2021;
  const rates = [];

  for (const rate of RATES) {
    const { week, weekend, night, title } = rate;
    rates.push({
      ...rate,
      year,
      name: `${year}-${title}`,
      color: '#ffffff',
      ...(await createStripePrices(
        week,
        weekend,
        night,
        title,
        year,
      ))
    })
  }

  return rates
}

exports.createRates = createRates;
