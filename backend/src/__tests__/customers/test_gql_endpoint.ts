import { query, mutate } from '../utils'
import { prisma } from '../../context'
import {
  QUERY_CUSTOMERS as GET_CUSTOMERS,
  MUTATION_ADD_CUSTOMER as CREATE_CUSTOMER,
  MUTATION_EDIT_CUSTOMER as UPDATE_CUSTOMER,
  MUTATION_DELETE_CUSTOMER as DELETE_CUSTOMERS,
} from '../../common/grapql_schemas/customers'

let customerId = -1

afterAll(async () => {
  await prisma.$disconnect()
})

const stripe = require('stripe')(process.env.STRIPE_SK)
describe('Customers endpoints', () => {
  it('creates a customer', async () => {
    const res = await mutate({
      mutation: CREATE_CUSTOMER,
      variables: {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.fr',
        phone: '+336451234342',
        language: 'FR',
        line1: '2 rue Emile Zola',
        line2: '',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
      },
    })
    customerId = res.data.createOneCustomer.id
    const customer = await prisma.customer.findUnique({
      where: { id: res.data.createOneCustomer.id },
    })
    expect(res.data.createOneCustomer).toMatchObject({
      stripeCustomer: res.data.createOneCustomer.stripeCustomer,
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.fr',
      phone: '+336451234342',
      language: 'FR',
      address: {
        line1: '2 rue Emile Zola',
        line2: '',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
      },
    })
    const customerStripe = await stripe.customers.retrieve(
      customer?.stripeCustomer,
    )
    expect(customerStripe).toMatchObject({
      id: res.data?.createOneCustomer.stripeCustomer,
      object: 'customer',
      name: `${res.data?.createOneCustomer.firstName} ${res.data?.createOneCustomer.lastName}`,
      email: res.data?.createOneCustomer.email,
      phone: res.data?.createOneCustomer.phone,
    })
  })
  it('updates a customer', async () => {
    const res = await mutate({
      mutation: UPDATE_CUSTOMER,
      variables: {
        customerId,
        firstName: 'testUpdated',
        lastName: 'testUpdated',
        email: 'testt@test.com',
        phone: '+3364541234342',
        language: 'EN',
        line1: '2 rue Emile Zola',
        line2: '',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
      },
    })
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })
    expect(res.data.updateOneCustomer).toMatchObject({
      stripeCustomer: customer?.stripeCustomer,
      firstName: 'testUpdated',
      lastName: 'testUpdated',
      email: 'testt@test.com',
      phone: '+3364541234342',
      language: 'EN',
      address: {
        line1: '2 rue Emile Zola',
        line2: '',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
      },
    })
    const customerStripe = await stripe.customers.retrieve(
      customer?.stripeCustomer,
    )
    expect(customerStripe).toMatchObject({
      id: res.data?.updateOneCustomer.stripeCustomer,
      object: 'customer',
      name: `${res.data?.updateOneCustomer.firstName} ${res.data?.updateOneCustomer.lastName}`,
      email: res.data?.updateOneCustomer.email,
      phone: res.data?.updateOneCustomer.phone,
    })
  })
  it('gets the customer list', async () => {
    const res = await query({ query: GET_CUSTOMERS })
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })
    expect(res.data.customers[1]).toMatchObject({
      id: customerId,
      stripeCustomer: customer?.stripeCustomer,
      firstName: 'testUpdated',
      lastName: 'testUpdated',
      email: 'testt@test.com',
      phone: '+3364541234342',
    })
  })
  it('deletes a customer', async () => {
    let customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })
    let customerStripe = await stripe.customers.retrieve(
      customer?.stripeCustomer,
    )
    const res = await mutate({
      mutation: DELETE_CUSTOMERS,
      variables: {
        id: customerId,
      },
    })
    expect(res.data?.deleteOneCustomer).toMatchObject({
      id: customerId,
      stripeCustomer: customer?.stripeCustomer,
      firstName: 'testUpdated',
      lastName: 'testUpdated',
      email: 'testt@test.com',
      phone: '+3364541234342',
    })
    customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })
    customerStripe = await stripe.customers.retrieve(
      res.data?.deleteOneCustomer.stripeCustomer,
    )
    expect(customer).toBeNull()
    expect(customerStripe).toMatchObject({ deleted: true })
  })
})
