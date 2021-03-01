import React, { SetStateAction, useEffect } from 'react';
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
import { activitySchema } from '../common/validations/activity';
import { ActivityType } from './types';

const FormActivity: React.ComponentType<{
  openDialog: boolean;
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
  addActivity: (activity: ActivityType) => Promise<void>;
  editActivity: (id: number, activity: ActivityType) => Promise<void>;
  activity: ActivityType | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}> = ({
  openDialog,
  setOpenDialog,
  addActivity,
  editActivity,
  activity,
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
      titleEn: '',
      descriptionEn: '',
      titleFr: '',
      descriptionFr: '',
      image: '',
      type: '',
    },
    resolver: yupResolver(activitySchema),
  });

  useEffect(() => {
    if (activity) {
      reset({
        titleEn: activity.titleEn,
        descriptionEn: activity.descriptionEn,
        titleFr: activity.titleFr,
        descriptionFr: activity.descriptionFr,
        image: activity.image,
        type: activity.type,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  const onSubmit = async (data: ActivityType): Promise<void> => {
    if (activity === null) {
      await addActivity({
        ...data,
      });
    } else {
      await editActivity(activity.id, {
        ...data,
      });
    }
  };

  return (
    <Dialog open={openDialog}>
      <DialogTitle id="form-dialog-title">
        {t('add a new activity')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="titleEn"
                name="titleEn"
                label={t('English title')}
                type="text"
                control={control}
                error={!!errors.titleEn}
                helperText={errors.titleEn ? t(errors.titleEn.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="descriptionEn"
                name="descriptionEn"
                label={t('English description')}
                type="text"
                control={control}
                error={!!errors.descriptionEn}
                helperText={
                  errors.descriptionEn ? t(errors.descriptionEn.message) : ''
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="titleFr"
                name="titleFr"
                label={t('French title')}
                type="text"
                control={control}
                error={!!errors.titleFr}
                helperText={errors.titleFr ? t(errors.titleFr.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="descriptionFr"
                name="descriptionFr"
                label={t('French description')}
                type="text"
                control={control}
                error={!!errors.descriptionFr}
                helperText={
                  errors.descriptionFr ? t(errors.descriptionFr.message) : ''
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                id="image"
                name="image"
                label={t('Image')}
                type="text"
                control={control}
                error={!!errors.image}
                helperText={errors.image ? t(errors.image.message) : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={
                  <Select labelId="type-label" id="type">
                    <MenuItem key="ACTIVITIES" value="ACTIVITIES">
                      {t('ACTIVITIES')}
                    </MenuItem>
                    <MenuItem key="RESTAURANT" value="RESTAURANT">
                      {t('RESTAURANT')}
                    </MenuItem>
                  </Select>
                }
                defaultValue={activity ? activity.type : 'ACTIVITIES'}
                name="type"
                control={control}
                error={!!errors.type}
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

export default FormActivity;
