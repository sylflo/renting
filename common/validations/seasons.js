/* eslint-disable */
const yup = require('yup');
const dayjs = require('dayjs');

const seasonSchema = yup.object().shape({
  start: yup
    .string()
    .typeError('start must be a date')
    .test(
      'season-has-to-start-from-a-saturday',
      'A season can either start from a saturday or the beginning of a year',
      function (value) {
        try {
          const start = dayjs(new Date(value));

          return (
            (start.date() === 1 && start.month() === 0) || start.day() === 6
          );
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    )
    .required(),
  end: yup
    .string()
    .typeError('start must be a date')
    .test(
      'season-has-to-end-from-a-friday',
      'A season can either end from a friday or the end of a year',
      function (value) {
        try {
          const end = dayjs(new Date(value));
          return (end.date() === 31 && end.month() === 11) || end.day() === 5;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    )
    .required(),
});

module.exports = { seasonSchema };
