import React, { Dispatch, SetStateAction } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Select, MenuItem, Grid } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { PriceItem } from '../../types';
import { rateSchema } from '../../../common/validations/seasons_rates';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const TITLE_OPTIONS = [
  'VERY_LOW_SEASON',
  'LOW_SEASON',
  'MIDDLE_SEASON',
  'HIGH_SEASON',
];

const FormRate: React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  editPrice: (id: number, priceToEdit: PriceItem) => Promise<void>;
  addPrice: (newPrice: PriceItem) => Promise<void>;
  price: PriceItem | null;
}> = ({ t, openDialog, setOpenDialog, editPrice, addPrice, price }) => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();
  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(rateSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any): Promise<void> => {
    if (price === null) {
      await addPrice(data);
    } else {
      await editPrice(price.id, data);
    }
  };

  const handleClose = (): void => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {t('add or edit price')}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  as={
                    <Select>
                      {TITLE_OPTIONS.map((title) => (
                        <MenuItem key={title} value={title}>
                          {t(title)}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  id="title"
                  name="title"
                  label="title"
                  control={control}
                  disabled={price !== null}
                  defaultValue={price !== null ? price.title : 'HIGH_SEASON'}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  as={TextField}
                  id="year"
                  name="year"
                  label={t('year')}
                  type="text"
                  control={control}
                  defaultValue={price !== null ? price.year : currentYear}
                  error={!!errors.year}
                  helperText={errors.year ? t(errors.year.message) : ''}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  as={TextField}
                  id="color"
                  label={t('color')}
                  name="color"
                  control={control}
                  defaultValue={price !== null ? price.color : ''}
                  error={!!errors.color}
                  helperText={errors.color ? t(errors.color.message) : ''}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  as={TextField}
                  id="week"
                  name="week"
                  label={t('week')}
                  type="number"
                  control={control}
                  defaultValue={price !== null ? price.week : 0}
                  error={!!errors.week}
                  helperText={errors.week ? t(errors.week.message) : ''}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  as={TextField}
                  id="night"
                  name="night"
                  control={control}
                  defaultValue={price !== null ? price.night : 0}
                  label={t('night')}
                  type="number"
                  error={!!errors.night}
                  helperText={errors.night ? t(errors.night.message) : ''}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  as={TextField}
                  id="weekend"
                  name="weekend"
                  control={control}
                  defaultValue={price !== null ? price.weekend : 0}
                  label={t('weekend')}
                  type="number"
                  error={!!errors.weekend}
                  helperText={errors.weekend ? t(errors.weekend.message) : ''}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  as={TextField}
                  id="minimumDuration"
                  name="minimumDuration"
                  control={control}
                  defaultValue={price !== null ? price.minimumDuration : 0}
                  label={t('minimum duration')}
                  type="number"
                  error={!!errors.minimumDuration}
                  helperText={
                    errors.minimumDuration
                      ? t(errors.minimumDuration.message)
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t('cancel')}
            </Button>
            <Button disabled={isSubmitting} type="submit" color="primary">
              {t('submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default FormRate;
