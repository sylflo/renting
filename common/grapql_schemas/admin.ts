import gql from 'graphql-tag';

const MUTATION_LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

export { MUTATION_LOGIN };
