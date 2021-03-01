import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import useCustomSnackbar from '../components/CustomSnackbar/useCustomSnackbar';
import {
  QUERY_CUSTOMERS,
  MUTATION_ADD_CUSTOMER,
  MUTATION_EDIT_CUSTOMER,
  MUTATION_DELETE_CUSTOMER,
} from '../common/grapql_schemas/customers';
import FormCustomer from './FormCustomer';
import DeleteDialogCustomer from './DeleteDialogCustomer';
import { CustomersQueryType, CustomerType } from './types';

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
  progress: {},
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
});

const Customers: React.ComponentType = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const snackbar = useCustomSnackbar();
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const { loading, data } = useQuery(QUERY_CUSTOMERS);
  const [addCustomerMutation] = useMutation(MUTATION_ADD_CUSTOMER, {
    update(cache, { data: { createOneCustomer } }) {
      cache.readQuery({ query: QUERY_CUSTOMERS });
      cache.writeQuery({
        query: QUERY_CUSTOMERS,
        data: {
          customers: [...data.customers, createOneCustomer],
        },
      });
    },
  });
  const [deleteCustomerMutation] = useMutation(MUTATION_DELETE_CUSTOMER, {
    update(
      cache,
      {
        data: {
          deleteOneCustomer: { id },
        },
      }
    ) {
      const customerData: CustomersQueryType | null = cache.readQuery({
        query: QUERY_CUSTOMERS,
      });
      if (!customerData) {
        return customerData;
      }
      return cache.writeQuery({
        query: QUERY_CUSTOMERS,
        data: {
          customers: customerData.customers.filter(
            (item: CustomerType) => item.id !== id
          ),
        },
      });
    },
  });
  const [editCustomerMutation] = useMutation(MUTATION_EDIT_CUSTOMER);

  if (loading) {
    return (
      <div className={classes.progressWrapper}>
        {' '}
        <CircularProgress size={100} />
      </div>
    );
  }

  const addCustomer: (newCustomer: CustomerType) => Promise<void> = async (
    newCustomer
  ) => {
    try {
      await addCustomerMutation({
        variables: {
          email: newCustomer.email,
          phone: newCustomer.phone,
          firstName: newCustomer.firstName,
          lastName: newCustomer.lastName,
          language: newCustomer.language,
          line1: newCustomer.line1,
          line2: newCustomer.line2,
          postalCode: newCustomer.postalCode,
          city: newCustomer.city,
          country: newCustomer.country,
        },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(`${t('the customer has been added')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured, the customer could not be add')}: ${t(
          err.message
        )}`
      );
    }
  };

  const editCustomer: (
    id: number,
    customer: CustomerType
  ) => Promise<void> = async (id, updatedCustomer) => {
    try {
      await editCustomerMutation({
        variables: {
          id,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          language: updatedCustomer.language,
          line1: updatedCustomer.line1,
          line2: updatedCustomer.line2,
          postalCode: updatedCustomer.postalCode,
          city: updatedCustomer.city,
          country: updatedCustomer.country,
        },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(`${t('the customer has been updated')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured the customer could not be updated')}: ${
          err.message
        }`
      );
    }
  };

  const deleteCustomer: () => Promise<void> = async () => {
    try {
      if (!customer || !customer.id) {
        return;
      }
      await deleteCustomerMutation({
        variables: { id: customer.id },
      });
      setOpenDialogDelete(false);
      snackbar.showSuccess(`${t('the customer has been deleted')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured the customer could not be deleted')}: ${t(
          err.message
        )}`
      );
    }
  };

  const { customers } = data;
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customer-table">
          <TableHead>
            <TableRow>
              <TableCell>{t('fullname')}</TableCell>
              <TableCell align="right">{t('email')}</TableCell>
              <TableCell align="right">{t('phone')}</TableCell>
              <TableCell align="right">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((item: CustomerType) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.firstName} {item.lastName}
                </TableCell>
                <TableCell align="right">{item.email}</TableCell>
                <TableCell align="right">{item.phone}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(): void => {
                      setCustomer(item);
                      setOpenDialogForm(true);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={(): void => {
                      setCustomer(item);
                      setOpenDialogDelete(true);
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        className={classes.fab}
        onClick={(): void => {
          setCustomer(null);
          setOpenDialogForm(true);
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <FormCustomer
        openDialog={openDialogForm}
        setOpenDialog={setOpenDialogForm}
        addCustomer={addCustomer}
        editCustomer={editCustomer}
        customer={customer}
        t={t}
      />
      <DeleteDialogCustomer
        deleteDialog={openDialogDelete}
        setOpenDialogDelete={setOpenDialogDelete}
        deleteCustomer={deleteCustomer}
        t={t}
      />
    </>
  );
};

export default Customers;
