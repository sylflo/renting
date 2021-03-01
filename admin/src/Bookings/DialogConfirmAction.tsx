import React, { SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@material-ui/core';
import { setDateFormat } from '../utils';
import { BookingType } from './types';

// `Are you sure you want to REFUSEEEE the booking from booking.start to booking.end a for the customer {booking.customer.firstName} {booking.customer.lastName}`

const DialogConfirmAction: React.ComponentType<{
  setOpenDialogConfirm: React.Dispatch<SetStateAction<boolean>>;
  confirmDialog: boolean;
  updateBookingStatus: (booking: number, status: string) => Promise<void>;
  booking: BookingType;
  bookingStatus: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}> = ({
  setOpenDialogConfirm,
  confirmDialog,
  updateBookingStatus,
  booking,
  bookingStatus,
  t,
}) => {
  const onSubmit = async (data: never): Promise<void> => {
    await updateBookingStatus(booking.id, bookingStatus);
  };
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Dialog open={confirmDialog}>
      <DialogTitle id="form-dialog-title">{t('Confirm action')}</DialogTitle>
      <DialogContent>
        <Typography component="p">
          {t('Are you sure you want to')}{' '}
          {bookingStatus === 'CANCELLED' ? t('cancel') : t('accept')}{' '}
          {t('the booking from')} {setDateFormat(booking.start)} {t('to')}{' '}
          {setDateFormat(booking.end)} {t('for the customer')}{' '}
          {booking.customer.firstName} {booking.customer.lastName}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): void => setOpenDialogConfirm(false)}
          color="primary"
        >
          {t('cancel')}
        </Button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button disabled={isSubmitting} type="submit" color="primary">
            {t('submit')}
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmAction;
