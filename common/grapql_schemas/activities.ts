import gql from 'graphql-tag';

const activityFragment = `
{
  id
  titleFr
  descriptionFr
  titleEn
  descriptionEn
  image
  type
}
`;
const QUERY_ACTIVITIES = gql`
query {
  activities {
    ...${activityFragment}
  }
}
`;

const MUTATION_ADD_ACTIVITY = gql`
mutation(
  $titleFr: String!
  $descriptionFr: String!
  $titleEn: String!
  $descriptionEn: String!
  $image: String!
  $type: ActivityType!
) {
  createOneActivity(
    data: {
      titleFr: $titleFr
      descriptionFr: $descriptionFr
      titleEn: $titleEn
      descriptionEn: $descriptionEn
      image: $image
      type: $type
    }
  ) {
    ...${activityFragment}
  }
}
`;

const MUTATION_EDIT_ACTIVITY = gql`
mutation(
  $id: Int!
  $titleFr: String!
  $descriptionFr: String!
  $titleEn: String!
  $descriptionEn: String!
  $image: String!
  $type: ActivityType!
) {
  updateOneActivity(
    where: {
      id: $id
    }
    data: {
      titleFr: { set: $titleFr }
      descriptionFr: { set: $descriptionFr }
      titleEn: { set: $titleEn }
      descriptionEn: { set: $descriptionEn }
      image: { set: $image }
      type: { set: $type }
    }
  ) {
    ...${activityFragment}
  }
}
`;

const MUTATION_DELETE_ONE_ACTIVITY = gql`
mutation($id: Int!) {
  deleteOneActivity(where: { id: $id }) {
    ...${activityFragment}
  }
}
`;

export {
  QUERY_ACTIVITIES,
  MUTATION_ADD_ACTIVITY,
  MUTATION_EDIT_ACTIVITY,
  MUTATION_DELETE_ONE_ACTIVITY,
};
