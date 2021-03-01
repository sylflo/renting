import * as yup from 'yup';

const activitySchema = yup.object().shape({
  titleEn: yup.string().required(),
  descriptionEn: yup.string().required(),
  titleFr: yup.string().required(),
  descriptionFr: yup.string().required(),
  image: yup.string().required(),
  type: yup.string().oneOf(['RESTAURANT', 'ACTIVITIES']).required(),
});

export { activitySchema };
