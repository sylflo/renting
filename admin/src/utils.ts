import moment from 'moment';

const setDateFormat = (date: string): string =>
  moment(date).format('DD-MM-YYYY');

export { setDateFormat };
