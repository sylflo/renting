type Activity = {
  id: number;
  titleFr: string;
  descriptionFr: string;
  titleEn: string;
  descriptionEn: string;
  image: string;
  type: string;
};

type ActivitiesQuery = {
  activities: [Activity];
};

export type ActivityType = Activity;
export type ActivitiesQueryType = ActivitiesQuery;
