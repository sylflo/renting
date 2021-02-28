import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import {
  CircularProgress,
  makeStyles,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  TableBody,
  IconButton,
  Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  QUERY_AMENITIES,
  MUTATION_DELETE_ONE_AMENITY,
  MUTATION_EDIT_AMENITY,
  MUTATION_ADD_AMENITY,
} from '../common/grapql_schemas/amenities';
import { AmenityType, AmenitiesQueryType } from './types';
import DeleteDialogAmenity from './DeleteDialogAmenity';
import FormAmenity from './FormAmenity';
import useCustomSnackbar from '../components/CustomSnackbar/useCustomSnackbar';

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

const Amenities = (): ReactElement => {
  const { t } = useTranslation();
  const classes = useStyles();
  const snackbar = useCustomSnackbar();
  const [amenity, setAmenity] = useState<AmenityType | null>(null);
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
  const { loading, data } = useQuery(QUERY_AMENITIES);
  const [addAmenityMutation] = useMutation(MUTATION_ADD_AMENITY, {
    update(cache, { data: { createOneAmenity } }) {
      cache.readQuery({ query: QUERY_AMENITIES });
      cache.writeQuery({
        query: QUERY_AMENITIES,
        data: {
          amenities: [...data.amenities, createOneAmenity],
        },
      });
    },
  });
  const [deleteAmenityMutation] = useMutation(MUTATION_DELETE_ONE_AMENITY, {
    update(
      cache,
      {
        data: {
          deleteOneAmenity: { id },
        },
      }
    ) {
      const amenitiesData: AmenitiesQueryType | null = cache.readQuery({
        query: QUERY_AMENITIES,
      });
      if (!amenitiesData) {
        return amenitiesData;
      }
      return cache.writeQuery({
        query: QUERY_AMENITIES,
        data: {
          amenities: amenitiesData.amenities.filter(
            (item: AmenityType) => item.id !== id
          ),
        },
      });
    },
  });
  const [editAmenityMutation] = useMutation(MUTATION_EDIT_AMENITY);

  if (loading) {
    return (
      <div className={classes.progressWrapper}>
        {' '}
        <CircularProgress size={100} />
      </div>
    );
  }

  const deleteAmenity: () => Promise<void> = async () => {
    try {
      if (!amenity || !amenity.id) {
        return;
      }
      await deleteAmenityMutation({
        variables: { id: amenity.id },
      });
      setOpenDialogDelete(false);
      snackbar.showSuccess(`${t('the amenity has been deleted')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured the amenity could not be deleted')}: ${t(
          err.message
        )}`
      );
    }
  };

  const addAmenity: (newAmenity: AmenityType) => Promise<void> = async (
    newAmenity
  ) => {
    try {
      await addAmenityMutation({
        variables: {
          titleEn: newAmenity.titleEn,
          descriptionEn: newAmenity.descriptionEn,
          titleFr: newAmenity.titleFr,
          descriptionFr: newAmenity.descriptionFr,
        },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(`${t('the amenity has been added')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured, the amenity could not be added')}: ${t(
          err.message
        )}`
      );
    }
  };

  const editAmenity: (
    id: number,
    amenity: AmenityType
  ) => Promise<void> = async (id, updatedAmenity) => {
    try {
      await editAmenityMutation({
        variables: {
          id,
          titleEn: updatedAmenity.titleEn,
          descriptionEn: updatedAmenity.descriptionEn,
          titleFr: updatedAmenity.titleFr,
          descriptionFr: updatedAmenity.descriptionFr,
        },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(`${t('the amenity has been updated')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured the amenity could not be updated')}: ${
          err.message
        }`
      );
    }
  };

  const { amenities } = data;
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="amenity-table">
          <TableHead>
            <TableRow>
              <TableCell>Title: En</TableCell>
              <TableCell>Description: En</TableCell>
              <TableCell>Title: Fr</TableCell>
              <TableCell>Description: Fr</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amenities.map((item: AmenityType) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.titleEn}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.descriptionEn}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.titleFr}
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.descriptionFr}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(): void => {
                      setAmenity(item);
                      setOpenDialogForm(true);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={(): void => {
                      setAmenity(item);
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
          setAmenity(null);
          setOpenDialogForm(true);
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <FormAmenity
        openDialog={openDialogForm}
        setOpenDialog={setOpenDialogForm}
        addAmenity={addAmenity}
        editAmenity={editAmenity}
        amenity={amenity}
        t={t}
      />
      <DeleteDialogAmenity
        deleteDialog={openDialogDelete}
        setOpenDialogDelete={setOpenDialogDelete}
        deleteAmenity={deleteAmenity}
        t={t}
      />
    </>
  );
};

export default Amenities;
