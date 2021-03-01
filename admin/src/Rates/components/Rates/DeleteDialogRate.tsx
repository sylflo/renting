import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@material-ui/core';
import { PriceItem } from '../../types';

const DeleteDialogRate: React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  deletePrice: (priceToDelete: PriceItem) => Promise<void>;
  price: PriceItem;
  setPrice: Dispatch<SetStateAction<PriceItem | null>>;
  deleteDialog: boolean;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ t, deletePrice, price, setPrice, deleteDialog, setDeleteDialog }) => {
  const onSubmit = async (data: unknown): Promise<void> => {
    await deletePrice(price);
  };
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Dialog open={deleteDialog}>
      <DialogTitle id="form-dialog-title">{t('delete price')}</DialogTitle>
      <DialogContent>
        <Typography component="p">
          {t('are you sure you want to delete the price')} {price.title}{' '}
          {t('of')} {price.year}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): void => {
            setDeleteDialog(false);
          }}
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

export default DeleteDialogRate;
