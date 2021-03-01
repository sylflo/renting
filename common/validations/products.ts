import * as yup from 'yup';

const productSchema = yup.object().shape({
  price: yup.number().min(0).integer().required(),
  status: yup.string().oneOf(['SECURITY_DEPOSIT', 'CLEANING']).required(),
});

export { productSchema };
