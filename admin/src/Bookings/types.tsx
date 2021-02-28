import { CustomerType } from '../Customers/types';

type Booking = {
  id: number;
  status: string;
  start: string;
  end: string;
  duration: number;
  totalPrice: number;
  totalAdults: number;
  totalKids: number;
  cleaning: boolean;
  message: string;
  customer: CustomerType;
};

export type BookingType = Booking;
