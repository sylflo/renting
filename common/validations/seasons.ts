/* eslint-disable */
import * as yup from 'yup';

const seasonSchema = yup.object().shape({
  start: yup.string().typeError('start must be a date').required(),
  end: yup.string().typeError('start must be a date').required(),
});

export { seasonSchema };
