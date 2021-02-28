import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useCustomSnackbar from '../components/CustomSnackbar/useCustomSnackbar';
import { QUERY_CUSTOMERS } from '../common/grapql_schemas/customers';
import {
  MUTATION_BOOKING_STATUS,
  MUTATION_CREATE_BOOKING,
  QUERY_BOOKINGS,
} from '../common/grapql_schemas/booking';
import { BookingType } from './types';
import BookingForm from './FormBooking';
import DialogConfirm from './DialogConfirmAction';
import { setDateFormat } from '../utils';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  progressWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'calc(100vh - 120px)',
    alignItems: 'center',
    justifyItems: 'center',
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
});

const Bookings: React.ComponentType = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const snackbar = useCustomSnackbar();
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [bookingConfirm, setBookingConfirm] = useState<BookingType | null>(
    null
  );
  const [bookingStatus, setBookingStatus] = useState('');
  const { loading, data: dataBookings } = useQuery(QUERY_BOOKINGS);
  const { loading: loadingCustomers, data: customers } = useQuery(
    QUERY_CUSTOMERS
  );
  const [updateBookingStatusMutation] = useMutation(MUTATION_BOOKING_STATUS);
  const [createBookingMutation] = useMutation(MUTATION_CREATE_BOOKING, {
    update(cache, { data: { createOneBooking } }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = cache.readQuery({ query: QUERY_BOOKINGS });
      cache.writeQuery({
        query: QUERY_BOOKINGS,
        data: {
          bookings: [...data.bookings, createOneBooking],
        },
      });
    },
  });

  const updateBookingStatus: (
    bookingId: number,
    status: string
  ) => Promise<void> = async (bookingId, status) => {
    try {
      await updateBookingStatusMutation({
        variables: { bookingId, status },
      });
      snackbar.showSuccess(t('The booking status has been updated') as string);
    } catch (err) {
      snackbar.showError(err.message);
    }
  };

  const addBooking: (booking: BookingType) => Promise<void> = async (
    booking
  ) => {
    try {
      await createBookingMutation({
        variables: { ...booking },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(t('The booking has been created') as string);
    } catch (err) {
      snackbar.showError(
        t('An error occured, the booking could not be created') as string
      );
    }
  };

  if (loadingCustomers || loading) {
    return (
      <div className={classes.progressWrapper}>
        {' '}
        <CircularProgress size={100} />
      </div>
    );
  }

  const { bookings } = dataBookings;
  return (
    <>
      <Fab
        className={classes.fab}
        onClick={(): void => {
          setOpenDialogForm(true);
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <BookingForm
        openDialog={openDialogForm}
        setOpenDialog={setOpenDialogForm}
        addBooking={addBooking}
        customers={customers.customers}
        t={t}
      />
      {bookingConfirm && (
        <DialogConfirm
          setOpenDialogConfirm={setOpenDialogConfirm}
          confirmDialog={openDialogConfirm}
          updateBookingStatus={updateBookingStatus}
          booking={bookingConfirm}
          bookingStatus={bookingStatus}
          t={t}
        />
      )}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="booking list">
          <TableHead>
            <TableRow>
              <TableCell>{t('customer')}</TableCell>
              <TableCell align="right">{t('status')}</TableCell>
              <TableCell align="right">{t('date')}</TableCell>
              <TableCell align="right">{t('duration')}</TableCell>
              <TableCell align="right">{t('price')}</TableCell>
              <TableCell align="right">{t('Nb of adult')}</TableCell>
              <TableCell align="right">{t('Nb of kids')}</TableCell>
              <TableCell align="right">{t('Cleaning')}</TableCell>
              <TableCell align="right">{t('message')}</TableCell>
              <TableCell align="right">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking: BookingType) => (
              <TableRow key={booking.id}>
                <TableCell component="th" scope="row">
                  {booking.customer.firstName} {booking.customer.lastName}
                </TableCell>
                <TableCell align="right">{t(booking.status)}</TableCell>
                <TableCell align="right">
                  {t('from')} {setDateFormat(booking.start)} {t('to')}{' '}
                  {setDateFormat(booking.end)}
                </TableCell>
                <TableCell>
                  {booking.duration} {t('day(s)')}
                </TableCell>
                <TableCell align="right">{booking.totalPrice}</TableCell>
                <TableCell align="right">{booking.totalAdults}</TableCell>
                <TableCell align="right">{booking.totalKids}</TableCell>
                <TableCell align="right">
                  {' '}
                  {booking.cleaning ? t('yes') : t('no')}
                </TableCell>
                <TableCell align="right">{booking.message}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={(): void => {
                      setOpenDialogConfirm(true);
                      setBookingConfirm(booking);
                      setBookingStatus('ACCEPT');
                    }}
                  >
                    {t('accept')}
                  </Button>
                  <Button
                    onClick={(): void => {
                      setOpenDialogConfirm(true);
                      setBookingConfirm(booking);
                      setBookingStatus('CANCEL');
                    }}
                  >
                    {t('refuse')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Bookings;
