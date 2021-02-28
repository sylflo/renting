import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerSchema, addressSchema } from '../common/validations/customer';
import { CustomerType } from './types';

const schema = customerSchema.concat(addressSchema);

const FormCustomer: React.ComponentType<{
  openDialog: boolean;
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
  addCustomer: (customer: CustomerType) => Promise<void>;
  editCustomer: (id: number, customer: CustomerType) => Promise<void>;
  customer: CustomerType | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}> = ({
  openDialog,
  setOpenDialog,
  addCustomer,
  editCustomer,
  customer,
  t,
}) => {
  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      language: 'EN',
      line1: '',
      line2: '',
      postalCode: '',
      city: '',
      country: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        language: customer.language,
        line1: customer.address.line1,
        line2: customer.address.line2,
        postalCode: customer.address.postalCode,
        city: customer.address.city,
        country: customer.address.country,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const [language, setLanguage] = useState('EN');
  const languages = ['EN', 'FR'];
  const onSubmit = async (data: CustomerType): Promise<void> => {
    if (customer === null) {
      await addCustomer({
        ...data,
        language,
      });
    } else {
      await editCustomer(customer.id, {
        ...data,
        language,
      });
    }
  };

  const handleSelectLanguage = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ): void => {
    setLanguage(event.target.value as string);
  };

  return (
    <Dialog open={openDialog}>
      <DialogTitle id="form-dialog-title">
        {t('add a new customer')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="firstName"
                name="firstName"
                label={t('first name')}
                type="text"
                control={control}
                error={!!errors.firstName}
                helperText={errors.firstName ? t(errors.firstName.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="lastName"
                name="lastName"
                label={t('last name')}
                type="text"
                control={control}
                error={!!errors.lastName}
                helperText={errors.lastName ? t(errors.lastName.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="email"
                name="email"
                label={t('email')}
                type="text"
                control={control}
                error={!!errors.email}
                helperText={errors.email ? t(errors.email.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="phone"
                name="phone"
                label={t('phone')}
                type="text"
                control={control}
                error={!!errors.phone}
                helperText={errors.phone ? t(errors.phone.message) : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render={(): any => (
                  <Select
                    onChange={(e): void => handleSelectLanguage(e)}
                    defaultValue={customer ? customer.language : 'EN'}
                  >
                    {languages.map((lang: string) => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name="language"
                control={control}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="line1"
                name="line1"
                label={t('line1')}
                type="text"
                control={control}
                error={!!errors.line1}
                helperText={errors.line1 ? t(errors.line1.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="line2"
                name="line2"
                label={t('line2')}
                type="text"
                control={control}
                error={!!errors.line2}
                helperText={errors.line2 ? t(errors.line2.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="postalCode"
                name="postalCode"
                label={t('postalCode')}
                type="text"
                control={control}
                error={!!errors.postalCode}
                helperText={
                  errors.postalCode ? t(errors.postalCode.message) : ''
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="city"
                name="city"
                label={t('city')}
                type="text"
                control={control}
                error={!!errors.city}
                helperText={errors.city ? t(errors.city.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="country"
                name="country"
                label={t('country')}
                type="text"
                control={control}
                error={!!errors.country}
                helperText={errors.country ? t(errors.country.message) : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label="cancel"
            onClick={(): void => setOpenDialog(false)}
            color="primary"
          >
            {t('cancel')}
          </Button>
          <Button
            aria-label="confirm"
            disabled={isSubmitting}
            type="submit"
            color="primary"
          >
            {t('submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormCustomer;
