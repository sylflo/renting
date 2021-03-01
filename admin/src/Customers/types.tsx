type Address = {
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  country: string;
};

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  country: string;
  address: Address;
};

type CustomersQuery = {
  customers: [Customer];
};

export type CustomerType = Customer;
export type CustomersQueryType = CustomersQuery;
