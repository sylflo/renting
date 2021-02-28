import React, { Dispatch, SetStateAction } from 'react';
import { Typography } from '@material-ui/core';
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
import { PriceItem } from '../../types';

const TableRate: React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classes: any;
  setPrice: Dispatch<SetStateAction<PriceItem | null>>;
  setOpenDialogForm: Dispatch<SetStateAction<boolean>>;
  setOpenDialogDelete: Dispatch<SetStateAction<boolean>>;
  prices: [PriceItem];
}> = ({
  t,
  classes,
  setPrice,
  setOpenDialogForm,
  setOpenDialogDelete,
  prices,
}) => (
  <>
    <Typography variant="h3" component="h2">
      {t('rates')}
    </Typography>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('title')}</TableCell>
            <TableCell>{t('week')}</TableCell>
            <TableCell>{t('night')}</TableCell>
            <TableCell>{t('weekend')}</TableCell>
            <TableCell>{t('minimum duration')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prices.map((price: PriceItem) => (
            <TableRow key={price.title}>
              <TableCell>{price.title}</TableCell>
              <TableCell>{price.week}</TableCell>
              <TableCell>{price.night}</TableCell>
              <TableCell>{price.weekend}</TableCell>
              <TableCell>{price.minimumDuration}</TableCell>
              <TableCell>
                <IconButton
                  onClick={(): void => {
                    setPrice(price);
                    setOpenDialogForm(true);
                  }}
                  aria-label="edit"
                >
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton
                  aria-label="delete-rate"
                  onClick={(): void => {
                    setPrice(price);
                    setOpenDialogDelete(true);
                  }}
                >
                  <DeleteIcon color="primary" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default TableRate;
