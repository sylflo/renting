import * as yup from 'yup';

const customerSchema = yup.object().shape({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phone: yup.string().required(),
  language: yup.string().oneOf(['FR', 'EN']),
});

const addressSchema = yup.object().shape({
  line1: yup.string().required(),
  line2: yup.string(),
  postalCode: yup.string().min(5).required(),
  city: yup.string().required(),
  country: yup.string().required(),
});

const gqlAddressSchema = yup
  .object()
  .shape({
    address: yup.object().shape({
      create: addressSchema,
    }),
  })
  .required();

const validateFullCustomerSchema = async (data) => {
  const gqlCustomerSchema = customerSchema.required().concat(gqlAddressSchema);
  await gqlCustomerSchema.validate(data);

  await gqlAddressSchema.validate(data);
};

const updatedCustomerSchema = yup.object().shape({
  email: yup.object({
    set: yup.string().email().required(),
  }),
  firstName: yup.object({
    set: yup.string().required(),
  }),
  lastName: yup.object({
    set: yup.string().required(),
  }),
  phone: yup.object({
    set: yup.string().required(),
  }),
  language: yup.object({
    set: yup.string().oneOf(['FR', 'EN']),
  }),
  address: yup.object().shape({
    update: yup.object().shape({
      line1: yup.object().shape({
        set: yup.string().required(),
      }),
      postalCode: yup.object().shape({
        set: yup.string().min(5).required(),
      }),
      city: yup.object().shape({
        set: yup.string().min(5).required(),
      }),
      country: yup.object().shape({
        set: yup.string().min(5).required(),
      }),
    }),
  }),
});

export {
  customerSchema,
  addressSchema,
  validateFullCustomerSchema,
  updatedCustomerSchema,
};
