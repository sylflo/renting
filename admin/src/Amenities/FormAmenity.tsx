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
} from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { amenitySchema } from '../common/validations/amenity';
import { AmenityType } from './types';

const FormAmenity: React.ComponentType<{
  openDialog: boolean;
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
  addAmenity: (amenity: AmenityType) => Promise<void>;
  editAmenity: (id: number, amenity: AmenityType) => Promise<void>;
  amenity: AmenityType | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}> = ({ openDialog, setOpenDialog, addAmenity, editAmenity, amenity, t }) => {
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
    },
    resolver: yupResolver(amenitySchema),
  });

  useEffect(() => {
    if (amenity) {
      reset({
        titleEn: amenity.titleEn,
        descriptionEn: amenity.descriptionEn,
        titleFr: amenity.titleFr,
        descriptionFr: amenity.descriptionFr,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amenity]);

  const onSubmit = async (data: AmenityType): Promise<void> => {
    if (amenity === null) {
      await addAmenity({
        ...data,
      });
    } else {
      await editAmenity(amenity.id, {
        ...data,
      });
    }
  };

  return (
    <Dialog open={openDialog}>
      <DialogTitle id="form-dialog-title">{t('add a new amenity')}</DialogTitle>
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

export default FormAmenity;
