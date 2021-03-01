import * as yup from 'yup';

/* Rate */
const rateSchema = yup.object().shape({
  title: yup
    .string()
    .oneOf(['VERY_LOW_SEASON', 'LOW_SEASON', 'MIDDLE_SEASON', 'HIGH_SEASON'])
    .required(),
  year: yup
    .number()
    .typeError('year must be a number')
    .required()
    .min(2000)
    .max(2030)
    .integer(),
  color: yup
    .string()
    .required()
    .matches(/^#[0-9a-f]{3,6}$/i, { excludeEmptyString: true }),
  week: yup
    .number()
    .typeError('week must be a number')
    .required()
    .min(0)
    .integer(),
  night: yup
    .number()
    .typeError('night must be a number')
    .required()
    .min(0)
    .integer(),
  weekend: yup
    .number()
    .typeError('weekend must be a number')
    .required()
    .min(0)
    .integer(),
  minimumDuration: yup
    .number()
    .typeError('minimumDuration must be a number')
    .required()
    .min(0)
    .integer(),
});

export { rateSchema };
