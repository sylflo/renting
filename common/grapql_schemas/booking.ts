import gql from 'graphql-tag';

const QUERY_BOOKINGS = gql`
  query {
    bookings {
      id
      status
      start
      end
      duration
      totalPrice
      totalAdults
      totalKids
      cleaning
      message
      customer {
        firstName
        lastName
      }
    }
  }
`;

const CALCULATE_BOOKING = gql`
  query($start: DateTime!, $end: DateTime!) {
    calculateBooking(start: $start, end: $end)
  }
`;
const MUTATION_CREATE_BOOKING = gql`
  mutation createOneBooking(
    $customerEmail: String!
    $start: DateTime!
    $end: DateTime!
    $cleaning: Boolean!
    $totalAdults: Int!
    $totalKids: Int!
    $message: String!
  ) {
    createOneBooking(
      data: {
        customer: { connect: { email: $customerEmail } }
        start: $start
        end: $end
        cleaning: $cleaning
        totalAdults: $totalAdults
        totalKids: $totalKids
        message: $message
      }
    ) {
      id
      status
      start
      end
      totalPrice
      cleaning
      message
      totalAdults
      totalKids
      customer {
        firstName
        lastName
        email
      }
    }
  }
`;

const MUTATION_BOOKING_STATUS = gql`
  mutation($bookingId: Int!, $status: String!) {
    changeBookingStatus(bookingId: $bookingId, status: $status) {
      id
      status
      start
      end
      totalPrice
      cleaning
      message
      totalAdults
      totalKids
    }
  }
`;

const QUERY_ONE_BOOKING = gql`
  query booking($id: Int!) {
    booking(where: { id: $id }) {
      id
      start
      end
      paymentByCard
      status
    }
  }
`;

export {
  CALCULATE_BOOKING,
  MUTATION_CREATE_BOOKING,
  MUTATION_BOOKING_STATUS,
  QUERY_ONE_BOOKING,
  QUERY_BOOKINGS,
};
