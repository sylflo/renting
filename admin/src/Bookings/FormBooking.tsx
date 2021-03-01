/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@material-ui/lab';
import { bookingSchema as schema } from '../common/validations/bookings';

const FormBooking: React.ComponentType<{
  openDialog: boolean;
  setOpenDialog: any;
  addBooking: any;
  customers: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}> = ({ openDialog, setOpenDialog, addBooking, customers, t }) => {
  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedDateStart, setSelectedDateStart] = React.useState(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = React.useState(new Date());
  const [customer, setCustomer] = React.useState<any | null>(customers[0]);

  const handleDateChangeStart = (date: any): void => {
    setSelectedDateStart(date);
  };
  const handleDateChangeEnd = (date: any): void => {
    setSelectedDateEnd(date);
  };

  const onSubmit = async (data: any): Promise<void> => {
    // eslint-disable-next-line no-param-reassign
    data.customerEmail = customer.email;
    // data['manual'] = true; // TODO optionnal and it is already set by the backend
    data.start = selectedDateStart.toISOString().split('T')[0];
    data.end = selectedDateEnd.toISOString().split('T')[0];
    await addBooking(data);
  };

  return (
    <Dialog open={openDialog}>
      <DialogTitle id="form-dialog-title">{t('add a new booking')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={6}>
            <DatePicker
              value={selectedDateStart}
              onChange={handleDateChangeStart}
              renderInput={(params): any => (
                <TextField {...params} variant="standard" />
              )}
            />
            <DatePicker
              value={selectedDateEnd}
              onChange={handleDateChangeEnd}
              renderInput={(params): any => (
                <TextField {...params} variant="standard" />
              )}
            />
            <Grid item xs={6}>
              <Autocomplete
                options={customers}
                getOptionLabel={(option: any) => option.email}
                id="customer"
                value={customer}
                onChange={(event: any, newValue: any | null) => {
                  setCustomer(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label={t('customer')}
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Controller
                    as={Checkbox}
                    id="cleaning"
                    name="cleaning"
                    control={control}
                    defaultValue={false}
                  />
                }
                label={t('Cleaning')}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="totalAdults"
                name="totalAdults"
                label={t('Nb of adult')}
                type="number"
                control={control}
                defaultValue=""
                error={!!errors.totalAdults}
                helperText={
                  errors.totalAdults ? t(errors.totalAdults.message) : ''
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="totalKids"
                name="totalKids"
                label={t('Nb of kids')}
                type="number"
                control={control}
                defaultValue=""
                error={!!errors.totalKids}
                helperText={errors.totalKids ? t(errors.totalKids.message) : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                id="message"
                name="message"
                label={t('message')}
                type="text"
                control={control}
                defaultValue=""
                multiline
                error={!!errors.message}
                helperText={errors.message ? t(errors.message.message) : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            {t('cancel')}
          </Button>
          <Button disabled={isSubmitting} type="submit" color="primary">
            {t('submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormBooking;
