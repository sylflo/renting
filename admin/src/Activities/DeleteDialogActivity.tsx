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

const DeleteDialogActivity: React.ComponentType<{
  setOpenDialogDelete: React.Dispatch<SetStateAction<boolean>>;
  deleteDialog: boolean;
  deleteActivity: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}> = ({ setOpenDialogDelete, deleteDialog, deleteActivity, t }) => {
  const onSubmit = async (_data: unknown): Promise<void> => {
    await deleteActivity();
  };
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Dialog open={deleteDialog}>
      <DialogTitle id="form-dialog-title">
        {t('delete activity') as string}
      </DialogTitle>
      <DialogContent>
        <Typography component="p">
          {`${t('are you sure you want to delete this activity ?')}`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): void => setOpenDialogDelete(false)}
          color="primary"
        >
          {t('cancel') as string}
        </Button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button disabled={isSubmitting} type="submit" color="primary">
            {t('submit') as string}
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialogActivity;
