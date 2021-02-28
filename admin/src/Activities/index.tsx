import React, { ReactElement, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  QUERY_ACTIVITIES,
  MUTATION_DELETE_ONE_ACTIVITY,
  MUTATION_EDIT_ACTIVITY,
  MUTATION_ADD_ACTIVITY,
} from '../common/grapql_schemas/activities';
import { ActivityType, ActivitiesQueryType } from './types';
import DeleteDialogActivity from './DeleteDialogActivity';
import FormActivity from './FormActivity';
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

const Activities = (): ReactElement => {
  const { t } = useTranslation();
  const classes = useStyles();
  const snackbar = useCustomSnackbar();
  const location = useLocation();
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
  const { loading, data } = useQuery(QUERY_ACTIVITIES);
  const [addActivityMutation] = useMutation(MUTATION_ADD_ACTIVITY, {
    update(cache, { data: { createOneActivity } }) {
      cache.readQuery({ query: QUERY_ACTIVITIES });
      cache.writeQuery({
        query: QUERY_ACTIVITIES,
        data: {
          activities: [...data.activities, createOneActivity],
        },
      });
    },
  });
  const [deleteActivityMutation] = useMutation(MUTATION_DELETE_ONE_ACTIVITY, {
    update(
      cache,
      {
        data: {
          deleteOneActivity: { id },
        },
      }
    ) {
      const activitiesData: ActivitiesQueryType | null = cache.readQuery({
        query: QUERY_ACTIVITIES,
      });
      if (!activitiesData) {
        return activitiesData;
      }
      return cache.writeQuery({
        query: QUERY_ACTIVITIES,
        data: {
          activities: activitiesData.activities.filter(
            (item: ActivityType) => item.id !== id
          ),
        },
      });
    },
  });
  const [editActivityMutation] = useMutation(MUTATION_EDIT_ACTIVITY);

  if (loading) {
    return (
      <div className={classes.progressWrapper}>
        {' '}
        <CircularProgress size={100} />
      </div>
    );
  }

  const deleteActivity: () => Promise<void> = async () => {
    try {
      if (!activity || !activity.id) {
        return;
      }
      await deleteActivityMutation({
        variables: { id: activity.id },
      });
      setOpenDialogDelete(false);
      snackbar.showSuccess(`${t('the activity has been deleted')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured the activity could not be deleted')}: ${t(
          err.message
        )}`
      );
    }
  };

  const addActivity: (newActivity: ActivityType) => Promise<void> = async (
    newActivity
  ) => {
    try {
      await addActivityMutation({
        variables: {
          titleEn: newActivity.titleEn,
          descriptionEn: newActivity.descriptionEn,
          titleFr: newActivity.titleFr,
          descriptionFr: newActivity.descriptionFr,
          image: newActivity.image,
          type: newActivity.type,
        },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(`${t('the activity has been added')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured, the activity could not be added')}: ${t(
          err.message
        )}`
      );
    }
  };

  const editActivity: (
    id: number,
    activity: ActivityType
  ) => Promise<void> = async (id, updatedActivity) => {
    try {
      await editActivityMutation({
        variables: {
          id,
          titleEn: updatedActivity.titleEn,
          descriptionEn: updatedActivity.descriptionEn,
          titleFr: updatedActivity.titleFr,
          descriptionFr: updatedActivity.descriptionFr,
          image: updatedActivity.image,
          type: updatedActivity.type,
        },
      });
      setOpenDialogForm(false);
      snackbar.showSuccess(`${t('the activity has been updated')}`);
    } catch (err) {
      snackbar.showError(
        `${t('an error occured the activity could not be updated')}: ${
          err.message
        }`
      );
    }
  };

  let { activities } = data;
  if (location.pathname.includes('activities')) {
    activities = activities.filter((item) => item.type === 'ACTIVITIES');
  } else {
    activities = activities.filter((item) => item.type === 'RESTAURANT');
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="activity-table">
          <TableHead>
            <TableRow>
              <TableCell>Title: En</TableCell>
              <TableCell>Description: En</TableCell>
              <TableCell>Title: Fr</TableCell>
              <TableCell>Description: Fr</TableCell>
              <TableCell>Image url</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((item: ActivityType) => (
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
                <TableCell component="th" scope="row">
                  {item.image}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(): void => {
                      setActivity(item);
                      setOpenDialogForm(true);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={(): void => {
                      setActivity(item);
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
          setActivity(null);
          setOpenDialogForm(true);
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <FormActivity
        openDialog={openDialogForm}
        setOpenDialog={setOpenDialogForm}
        addActivity={addActivity}
        editActivity={editActivity}
        activity={activity}
        t={t}
      />
      <DeleteDialogActivity
        deleteDialog={openDialogDelete}
        setOpenDialogDelete={setOpenDialogDelete}
        deleteActivity={deleteActivity}
        t={t}
      />
    </>
  );
};

export default Activities;
