import gql from 'graphql-tag';

const amenityFragment = gql`
  {
    id
    titleFr
    descriptionFr
    titleEn
    descriptionEn
  }
`;
const QUERY_AMENITIES = gql`
query {
  amenities {
    ...${amenityFragment}
  }
}
`;

const MUTATION_ADD_AMENITY = gql`
mutation(
  $titleEn: String!
  $descriptionEn: String!
  $titleFr: String!
  $descriptionFr: String!
  ) {
  createOneAmenity(
    data: {
      titleEn: $titleEn
      descriptionEn: $descriptionEn
      titleFr: $titleFr
      descriptionFr: $descriptionFr
    }
  ) {
    ...${amenityFragment}
  }
}
`;

const MUTATION_EDIT_AMENITY = gql`
  mutation(
    $id: Int!
    $titleEn: String!
    $descriptionEn: String!
    $titleFr: String!
    $descriptionFr: String!
  ) {
    updateOneAmenity(
      where: { id: $id }
      data: {
        titleEn: { set: $titleEn }
        descriptionEn: { set: $descriptionEn }
        titleFr: { set: $titleFr }
        descriptionFr: { set: $descriptionFr }
      }
    ) {
      ...${amenityFragment}
    }
  }
`;

const MUTATION_DELETE_ONE_AMENITY = gql`
mutation($id: Int!) {
  deleteOneAmenity(where: { id: $id }) {
    ...${amenityFragment}
  }
}
`;

export {
  QUERY_AMENITIES,
  MUTATION_DELETE_ONE_AMENITY,
  MUTATION_EDIT_AMENITY,
  MUTATION_ADD_AMENITY,
};
