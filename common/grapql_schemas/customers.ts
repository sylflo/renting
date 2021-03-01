import gql from 'graphql-tag';

const customerFragment = `
{
  id
  stripeCustomer
  language
  firstName
  lastName
  email
  phone
  address {
    line1
    line2
    postalCode
    city
    country
  }
}
`;

const QUERY_CUSTOMERS = gql`
  query {
    customers {
      ...${customerFragment}
    }
  }
`;

const MUTATION_ADD_CUSTOMER = gql`
  mutation createOneCustomer(
    $email: String!
    $phone: String!
    $firstName: String!
    $lastName: String!
    $language: String!
    $line1: String!
    $line2: String!
    $postalCode: String!
    $city: String!
    $country: String!
  ) {
    createOneCustomer(
      data: {
        email: $email
        phone: $phone
        firstName: $firstName
        lastName: $lastName
        language: $language
        address: {
          create: {
            line1: $line1
            line2: $line2
            postalCode: $postalCode
            city: $city
            country: $country
          }
        }
      }
    ) {
      ...${customerFragment}
    }
  }
`;

const MUTATION_EDIT_CUSTOMER = gql`
  mutation(
    $customerId: Int!
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $language: String!
    $line1: String!
    $line2: String!
    $postalCode: String!
    $city: String!
    $country: String!
  ) {
    updateOneCustomer(
      where: { id: $customerId }
      data: {
        firstName: { set: $firstName }
        lastName: { set: $lastName }
        email: { set: $email }
        phone: { set: $phone }
        language: { set: $language }
        address: {
          update: {
            line1: { set: $line1 }
            line2: { set: $line2 }
            postalCode: { set: $postalCode }
            city: { set: $city }
            country: { set: $country }
          }
        }
      }
    ) {
      ...${customerFragment}
    }
  }
`;

const MUTATION_DELETE_CUSTOMER = gql`
  mutation($id: Int!) {
    deleteOneCustomer(where: { id: $id }) {
      ...${customerFragment}
    }
  }
`;

const MUTATION_DELETE_CUSTOMER_BY_EMAIL = gql`
mutation($email: String!) {
  deleteOneCustomer(where: { email: $email }) {
    ...${customerFragment}
  }
}
`;
export {
  QUERY_CUSTOMERS,
  MUTATION_ADD_CUSTOMER,
  MUTATION_EDIT_CUSTOMER,
  MUTATION_DELETE_CUSTOMER,
  MUTATION_DELETE_CUSTOMER_BY_EMAIL,
};
