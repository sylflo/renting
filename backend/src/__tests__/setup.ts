import { createSeasonsAndRates } from './bookings/utils_functions'

import './utils'

module.exports = async () => {
  await createSeasonsAndRates()
}
