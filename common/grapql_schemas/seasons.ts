import gql from 'graphql-tag';

const MUTATION_ADD_SEASON = gql`
  mutation newSeason($rateId: Int!, $start: DateTime!, $end: DateTime!) {
    createSeason(seasonRateId: $rateId, start: $start, end: $end) {
      id
      start
      end
      date
    }
  }
`;

const MUTATION_DELETE_SEASON = gql`
  mutation deleteSeason(
    $seasonRateId: Int!
    $start: DateTime!
    $end: DateTime!
  ) {
    deleteSeason(seasonRateId: $seasonRateId, start: $start, end: $end) {
      date
      start
      end
      seasonRateId
    }
  }
`;

export { MUTATION_ADD_SEASON, MUTATION_DELETE_SEASON };
