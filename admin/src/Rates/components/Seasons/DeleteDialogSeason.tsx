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
import { Season } from '../../types';
import { setDateFormat } from '../../../utils';

const DeleteDialogSeason: React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  openDialog: boolean;
  setDialog: Dispatch<SetStateAction<boolean>>;
  season: Season[];
  deleteSeason: (
    seasonRateId: number,
    start: string,
    end: string
  ) => Promise<void>;
}> = ({ t, openDialog, setDialog, season, deleteSeason }) => {
  const onSubmit = async (data: never): Promise<void> => {
    await deleteSeason(season[0].rate.id, season[0].date, season[1].date);
  };
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <Dialog open={openDialog}>
      <DialogTitle id="form-dialog-title">{t('delete the season')}</DialogTitle>
      <DialogContent>
        <Typography component="p">
          {t('are you sure you want to delete the season from')}{' '}
          {setDateFormat(season[0].date)}
          {t('to')} {setDateFormat(season[1].date)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): void => setDialog(false)} color="primary">
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

export default DeleteDialogSeason;
