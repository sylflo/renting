import { Address, Booking, Customer } from '@prisma/client'

type CustomerWithBookings = Customer & { bookings: Booking[] }
type CustomerWithAddress = Customer & { address: Address | null }

export { CustomerWithBookings, CustomerWithAddress }
