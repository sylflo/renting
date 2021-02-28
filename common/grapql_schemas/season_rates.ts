import gql from 'graphql-tag';

const QUERY_PRICES = gql`
  query rate {
    seasonRates {
      id
      title
      year
      week
      night
      weekend
      minimumDuration
      color
      seasons(
        where: { OR: [{ start: { equals: true } }, { end: { equals: true } }] }
      ) {
        id
        date
        start
        end
        rate {
          id
          color
          title
        }
      }
    }
  }
`;

const MUTATION_ADD_PRICE = gql`
  mutation createOneSeasonRate(
    $title: TitleRate!
    $color: String!
    $year: Int!
    $week: Int!
    $night: Int!
    $weekend: Int!
    $minimumDuration: Int!
  ) {
    createOneSeasonRate(
      data: {
        title: $title
        color: $color
        year: $year
        week: $week
        night: $night
        weekend: $weekend
        minimumDuration: $minimumDuration
      }
    ) {
      id
      name
      title
      year
      color
      week
      night
      weekend
      minimumDuration
      stripePriceIdWeekDeposit
      stripePriceIdWeekendDeposit
      stripePriceIdNightDeposit
      stripePriceIdWeekRemaining
      stripePriceIdWeekendRemaining
      stripePriceIdNightRemaining
    }
  }
`;

const MUTATION_EDIT_PRICE = gql`
  mutation changePrice(
    $id: Int!
    $color: String!
    $week: Int!
    $night: Int!
    $weekend: Int!
    $minimumDuration: Int!
  ) {
    updateOneSeasonRate(
      where: { id: $id }
      data: {
        week: { set: $week }
        night: { set: $night }
        weekend: { set: $weekend }
        minimumDuration: { set: $minimumDuration }
        color: { set: $color }
      }
    ) {
      id
      title
      year
      name
      week
      night
      weekend
      minimumDuration
      color
      stripePriceIdWeekDeposit
      stripePriceIdWeekendDeposit
      stripePriceIdNightDeposit
      stripePriceIdWeekRemaining
      stripePriceIdWeekendRemaining
      stripePriceIdNightRemaining
    }
  }
`;

const GET_SEASON_RATE = gql`
  query {
    seasonRates {
      id
      title
      year
      name
      week
      night
      weekend
      minimumDuration
      color
      stripePriceIdWeekDeposit
      stripePriceIdWeekendDeposit
      stripePriceIdNightDeposit
      stripePriceIdWeekRemaining
      stripePriceIdWeekendRemaining
      stripePriceIdNightRemaining
    }
  }
`;

const DELETE_SEASON_RATE = gql`
  mutation($id: Int!) {
    deleteOneSeasonRate(where: { id: $id }) {
      id
      title
      year
      name
      week
      night
      weekend
      minimumDuration
      color
      stripePriceIdWeekDeposit
      stripePriceIdWeekendDeposit
      stripePriceIdNightDeposit
      stripePriceIdWeekRemaining
      stripePriceIdWeekendRemaining
      stripePriceIdNightRemaining
    }
  }
`;

export {
  MUTATION_ADD_PRICE,
  MUTATION_EDIT_PRICE,
  GET_SEASON_RATE,
  DELETE_SEASON_RATE,
  QUERY_PRICES,
};
