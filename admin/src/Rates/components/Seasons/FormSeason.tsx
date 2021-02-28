/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Grid,
  Select,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/lab';
import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { seasonSchema, seasonEnumSchema } from '../../../validations';
import { PriceItem } from '../../types';

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

// const schema = seasonSchema.concat(seasonEnumSchema);

const FormSeason: React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // prices: PriceYear | {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prices: any;
  addSeason: (rateId: number, start: string, end: string) => Promise<void>;
}> = ({ t, open, setOpen, prices, addSeason }) => {
  const classes = useStyles();

  const [years, setYears] = useState<string[]>([]);
  const [year, setYear] = useState<string>('');
  // const [seasons, setSeasons] = useState<[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [seasons, setSeasons] = useState<any>([]);
  const [selectedDateStart, setSelectedDateStart] = useState<Date | null>(
    new Date()
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | null>(
    new Date()
  );

  useEffect(() => {
    setYears(Object.keys(prices));
  }, [prices]);

  useEffect(() => {
    setYear(years[0]);
  }, [years]);

  useEffect(() => {
    if (year && prices && prices[year]?.prices) {
      setSeasons(prices[year].prices.map((price: PriceItem) => price.title));
    }
  }, [year, prices]);

  const handleClose = (): void => {
    setOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any): Promise<void> => {
    if (selectedDateStart && selectedDateEnd) {
      const rateId = prices[year].prices.find(
        (el: PriceItem) => el.title === data.season
      ).id;
      await addSeason(
        rateId,
        selectedDateStart.toISOString().split('T')[0],
        selectedDateEnd.toISOString().split('T')[0]
      );
    }
  };

  const handleSelectYear = (
    // event: ChangeEvent<{ name?: string | undefined; value: unknown}>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any
  ): string => {
    if (event[1].key !== '') {
      const {
        props: { value: key },
      } = event[1];
      setYear(key);
      return key;
    }
    return '';
  };

  const handleDateChangeStart = (
    date: Date | null,
    keyboardInputValue?: string | undefined
  ): void => {
    setSelectedDateStart(date);
  };
  const handleDateChangeEnd = (
    date: Date | null,
    keyboardInputValue?: string | undefined
  ): void => {
    setSelectedDateEnd(date);
  };

  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm({
    // resolver: yupResolver(schema),
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {t('add or edit season')}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Controller
                as={
                  <Select>
                    {years.map((item: string) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                }
                defaultValue={year}
                name={year}
                control={control}
                onChange={handleSelectYear}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={
                  <Select labelId="season-label" id="season">
                    {seasons.map((season: string) => (
                      <MenuItem key={season} value={season}>
                        {t(season)}
                      </MenuItem>
                    ))}
                  </Select>
                }
                defaultValue={seasons.length ? '' : seasons.length[0]}
                name="season"
                control={control}
                error={!!errors.season}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                value={selectedDateStart}
                onChange={handleDateChangeStart}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderInput={(params): any => (
                  <TextField {...params} variant="standard" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                value={selectedDateEnd}
                onChange={handleDateChangeEnd}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderInput={(params): any => (
                  <TextField {...params} variant="standard" />
                )}
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
  );
};

export default FormSeason;
