/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import {
  QUERY_PRICES,
  DELETE_SEASON_RATE,
  MUTATION_EDIT_PRICE,
  MUTATION_ADD_PRICE,
} from '../common/grapql_schemas/season_rates';
import {
  MUTATION_ADD_SEASON,
  MUTATION_DELETE_SEASON,
} from '../common/grapql_schemas/seasons';
import {
  PriceItem,
  // PriceYear,
  QueryPrice,
  Season as SeasonType,
} from './types';
import useCustomSnackbar from '../components/CustomSnackbar/useCustomSnackbar';
import PriceTable from './components/Rates/TableRate';
import PriceForm from './components/Rates/FormRate';
import DeleteDialogRate from './components/Rates/DeleteDialogRate';
import ActionButton from './components/ActionButton';
import Season from './components/Seasons';
import SeasonForm from './components/Seasons/FormSeason';
import DeleteDialogSeason from './components/Seasons/DeleteDialogSeason';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  fab: {
    margin: 0,
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed',
  },
  collapseButton: {
    marginTop: '3rem',
  },
  progressWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'calc(100vh - 120px)',
    alignItems: 'center',
    justifyItems: 'center',
  },
  progress: {},
}));

const Prices: React.ComponentType = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const snackbar = useCustomSnackbar();
  const { loading, data, refetch } = useQuery(QUERY_PRICES);
  const [editPriceMutation] = useMutation(MUTATION_EDIT_PRICE);
  const [addPriceMutation] = useMutation(MUTATION_ADD_PRICE, {
    update(cache, { data: { createOneSeasonRate } }) {
      const queryData: null | QueryPrice = cache.readQuery({
        query: QUERY_PRICES,
      });
      if (!queryData || !queryData.seasonRates) {
        return;
      }
      cache.writeQuery({
        query: QUERY_PRICES,
        data: {
          seasonRates: [...queryData.seasonRates, createOneSeasonRate],
        },
      });
    },
  });
  const [deletePriceMutation] = useMutation(DELETE_SEASON_RATE, {
    update(
      cache,
      {
        data: {
          deleteOneSeasonRate: { id },
        },
      }
    ) {
      const queryData: null | QueryPrice = cache.readQuery({
        query: QUERY_PRICES,
      });
      if (!queryData || !queryData.seasonRates) {
        return;
      }
      cache.writeQuery({
        query: QUERY_PRICES,
        data: {
          seasonRates: queryData.seasonRates.filter(
            (seasonRate: PriceItem) => seasonRate.id !== id
          ),
        },
      });
    },
  });
  const [addSeasonMutation] = useMutation(MUTATION_ADD_SEASON);
  const [deleteSeasonMutation] = useMutation(MUTATION_DELETE_SEASON);

  // const [prices, setPrices] = useState<PriceYear | {}>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prices, setPrices] = useState<any>({});
  const [price, setPrice] = useState<PriceItem | null>(null);
  const [season, setSeason] = useState<SeasonType[] | null>(null);
  const [openDialogFormPrice, setOpenDialogFormPrice] = useState<boolean>(
    false
  );
  const [deleteDialogPrice, setOpenDeleteDialogPrice] = useState<boolean>(
    false
  );
  const [openDialogSeason, setOpenDialogSeason] = useState<boolean>(false);
  const [openDeleteDialogSeason, setOpenDeleteDialogSeason] = useState<boolean>(
    false
  );

  const editPrice: (
    id: number,
    priceToEdit: PriceItem
  ) => Promise<void> = async (id, priceToEdit) => {
    try {
      await editPriceMutation({
        variables: {
          id,
          color: priceToEdit.color,
          week: priceToEdit.week,
          night: priceToEdit.night,
          weekend: priceToEdit.weekend,
          minimumDuration: priceToEdit.minimumDuration,
        },
      });
      setOpenDialogFormPrice(false);
      snackbar.showSuccess(t('the price has been edited') as string);
    } catch (err) {
      snackbar.showError(
        t('an error occured, the price could not be edited') as string
      );
    }
  };

  const addPrice: (newPrice: PriceItem) => Promise<void> = async (newPrice) => {
    try {
      await addPriceMutation({
        variables: {
          title: newPrice.title,
          color: newPrice.color,
          year: newPrice.year,
          week: newPrice.week,
          night: newPrice.night,
          weekend: newPrice.weekend,
          minimumDuration: newPrice.minimumDuration,
        },
      });
      setOpenDialogFormPrice(false);
      snackbar.showSuccess(t('the price has been added') as string);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured')}, ${t('the price could not be add')}: ${
          err.message
        }`
      );
    }
  };

  const deletePrice: (priceToDelete: PriceItem) => Promise<void> = async (
    priceToDelete
  ) => {
    try {
      await deletePriceMutation({
        variables: { id: priceToDelete.id },
      });
      setOpenDeleteDialogPrice(false);
      snackbar.showSuccess(t('The price  has been deleted') as string);
    } catch (err) {
      snackbar.showError(
        t('an error occured the price could not be deleted') as string
      );
    }
  };

  const addSeason: (
    rateId: number,
    start: string,
    end: string
  ) => Promise<void> = async (rateId, start, end) => {
    try {
      await addSeasonMutation({
        variables: {
          rateId,
          start,
          end,
        },
      });
      setOpenDialogSeason(false);
      refetch();
      snackbar.showSuccess(t('the season has been added') as string);
    } catch (err) {
      snackbar.showError(
        t('an error occured the season could not be added') as string
      );
    }
  };

  const deleteSeason: (
    seasonRateId: number,
    start: string,
    end: string
  ) => Promise<void> = async (seasonRateId, start, end) => {
    try {
      await deleteSeasonMutation({
        variables: {
          seasonRateId,
          start,
          end,
        },
      });
      refetch();
      setOpenDeleteDialogSeason(false);
      snackbar.showSuccess(t('the season has been deleted') as string);
    } catch (err) {
      snackbar.showError(
        t('an error occured the season could not be deleted') as string
      );
    }
  };

  useEffect(() => {
    if (!loading) {
      const pricesData = Object();
      data.seasonRates.forEach((grapqlPrice: PriceItem) => {
        if (grapqlPrice.year in pricesData) {
          pricesData[grapqlPrice.year].prices.push(grapqlPrice);
          // eslint-disable-next-line max-len
          pricesData[grapqlPrice.year].seasons = pricesData[
            grapqlPrice.year
          ].seasons.concat(grapqlPrice.seasons);
        } else {
          pricesData[grapqlPrice.year] = {
            prices: [grapqlPrice],
            seasons: grapqlPrice.seasons,
            collapse: false,
          };
        }
      });
      setPrices(pricesData);
    }
  }, [data, loading]);

  if (loading) {
    return (
      <div className={classes.progressWrapper}>
        {' '}
        <CircularProgress size={100} />
      </div>
    );
  }

  return (
    <>
      {prices &&
        Object.keys(prices).map((key: string, _: unknown) => (
          <div key={key} className={classes.collapseButton}>
            <Button
              variant="contained"
              color="primary"
              onClick={(): void =>
                setPrices({
                  ...prices,
                  [key]: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(prices[key] as any),
                    collapse: !prices![key].collapse,
                  },
                })
              }
            >
              {key}
            </Button>

            <Collapse in={prices![key].collapse} timeout="auto" unmountOnExit>
              <Season
                t={t}
                seasons={prices![key].seasons}
                setSeason={setSeason}
                setDeleteDialog={setOpenDeleteDialogSeason}
              />
              <PriceTable
                t={t}
                classes={classes}
                setPrice={setPrice}
                setOpenDialogForm={setOpenDialogFormPrice}
                setOpenDialogDelete={setOpenDeleteDialogPrice}
                prices={prices![key].prices}
              />
            </Collapse>
          </div>
        ))}
      <ActionButton
        setPrice={setPrice}
        setOpenDialogPrice={setOpenDialogFormPrice}
        setOpenDialogSeason={setOpenDialogSeason}
      />
      <SeasonForm
        t={t}
        open={openDialogSeason}
        setOpen={setOpenDialogSeason}
        prices={prices}
        addSeason={addSeason}
      />
      {season && (
        <DeleteDialogSeason
          t={t}
          openDialog={openDeleteDialogSeason}
          setDialog={setOpenDeleteDialogSeason}
          season={season}
          deleteSeason={deleteSeason}
        />
      )}
      <PriceForm
        t={t}
        addPrice={addPrice}
        editPrice={editPrice}
        price={price}
        openDialog={openDialogFormPrice}
        setOpenDialog={setOpenDialogFormPrice}
      />
      {price !== null && (
        <DeleteDialogRate
          t={t}
          deletePrice={deletePrice}
          price={price}
          setPrice={setPrice}
          deleteDialog={deleteDialogPrice}
          setDeleteDialog={setOpenDeleteDialogPrice}
        />
      )}
    </>
  );
};

export default Prices;
