import * as yup from 'yup';

const amenitySchema = yup.object().shape({
  titleEn: yup.string().required(),
  descriptionEn: yup.string().required(),
  titleFr: yup.string().required(),
  descriptionFr: yup.string().required(),
});

export { amenitySchema };
