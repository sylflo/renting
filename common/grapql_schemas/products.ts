import gql from 'graphql-tag';

const CREATE_PRODUCT = gql`
  mutation($price: Int!, $status: ProductStatus!) {
    createOneProduct(data: { price: $price, status: $status }) {
      id
      price
      status
      stripePriceId
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation($price: Int!, $status: ProductStatus!) {
    updateOneProduct(
      where: { status: $status }
      data: { price: { set: $price }, status: { set: $status } }
    ) {
      id
      price
      status
      stripePriceId
    }
  }
`;

export { CREATE_PRODUCT, UPDATE_PRODUCT };
