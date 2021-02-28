import { extendType, objectType } from 'nexus'

const Activity = objectType({
  name: 'Activity',
  definition(t) {
    t.model.id()
    t.model.titleFr()
    t.model.descriptionFr()
    t.model.titleEn()
    t.model.descriptionEn()
    t.model.image()
    t.model.type()
  },
})

const QueryActivity = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.activities(), t.crud.activity()
  },
})

const MutationActivity = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneActivity(),
      t.crud.updateOneActivity(),
      t.crud.updateManyActivity(),
      t.crud.deleteOneActivity(),
      t.crud.deleteManyActivity()
  },
})

export { Activity, QueryActivity, MutationActivity }
