import { extendType, objectType } from 'nexus'

const Amenity = objectType({
  name: 'Amenity',
  definition(t) {
    t.model.id()
    t.model.titleFr()
    t.model.descriptionFr()
    t.model.titleEn()
    t.model.descriptionEn()
  },
})

const QueryAmenity = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.amenities(), t.crud.amenity()
  },
})

const MutationAmenity = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneAmenity(),
      t.crud.updateOneAmenity(),
      t.crud.updateManyAmenity(),
      t.crud.deleteOneAmenity(),
      t.crud.deleteManyAmenity()
  },
})

export { Amenity, QueryAmenity, MutationAmenity }
