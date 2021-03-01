import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';

import { Season } from '../../types';
import { setDateFormat } from '../../../utils';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Seasons: React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  seasons: [Season];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSeason: Dispatch<SetStateAction<any>>;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ t, seasons, setSeason, setDeleteDialog }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h3" component="h2">
        {t('season')}
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('date range')}</TableCell>
              <TableCell>{t('season')}</TableCell>
              <TableCell align="right">{t('action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seasons !== undefined &&
              seasons.map((season: Season, index: number) => {
                if (index % 2 === 0) {
                  return (
                    <TableRow key={seasons[index].date}>
                      <TableCell component="th" scope="row">
                        <Typography component="p">
                          {t('from')} {setDateFormat(seasons[index].date)}{' '}
                          {t('to')} {setDateFormat(seasons[index + 1].date)}
                        </Typography>
                      </TableCell>
                      <TableCell>{t(season.rate.title)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="delete"
                          onClick={(): void => {
                            setSeason(seasons.slice(index, index + 2));
                            setDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                }
                return null;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Seasons;
