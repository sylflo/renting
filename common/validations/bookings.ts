import * as yup from 'yup';

const changeBookingStatusSchema = yup.object().shape({
  bookingId: yup
    .number()
    .typeError('bookingId must be a number')
    .required()
    .min(1)
    .integer(),
  status: yup.string().oneOf(['ACCEPT', 'CANCEL']).required(),
});

const bookingSchema = yup.object().shape({
  start: yup.date().typeError('start must be a date').required(),
  end: yup.date().when('start', (start, schema) => start && schema.min(start)),
  totalAdults: yup
    .number()
    .typeError('totalAdults must be a number')
    .required()
    .min(0)
    .integer(),
  totalKids: yup
    .number()
    .typeError('totalKids must be a number')
    .required()
    .min(0)
    .integer(),
  cleaning: yup.boolean().required(),
  message: yup.string(),
  customer: yup
    .object()
    .shape({
      connect: yup
        .object()
        .shape({
          email: yup
            .string()
            .email()
            .typeError('email must be a valid email address')
            .required(),
        })
        .required(),
    })
    .required(),
});

export { changeBookingStatusSchema, bookingSchema };
