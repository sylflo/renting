type Amenity = {
  id: number;
  titleFr: string;
  descriptionFr: string;
  titleEn: string;
  descriptionEn: string;
};

type AmenitiesQuery = {
  amenities: [Amenity];
};

export type AmenityType = Amenity;
export type AmenitiesQueryType = AmenitiesQuery;
