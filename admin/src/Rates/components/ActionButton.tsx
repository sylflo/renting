import React, { SetStateAction } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/core/SpeedDial';
import SpeedDialIcon from '@material-ui/core/SpeedDialIcon';
import SpeedDialAction from '@material-ui/core/SpeedDialAction';
import EuroIcon from '@material-ui/icons/Euro';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { PriceItem as PriceItemType } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transform: 'translateZ(0px)',
      flexGrow: 1,
    },
    exampleWrapper: {
      position: 'relative',
      marginTop: theme.spacing(3),
      height: 380,
    },
    radioGroup: {
      margin: theme.spacing(1, 0),
    },
    speedDial: {
      position: 'absolute',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(1),
        right: theme.spacing(1),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(1),
        left: theme.spacing(1),
      },
    },
  })
);

const SpeedDials: React.ComponentType<{
  setPrice: React.Dispatch<SetStateAction<PriceItemType | null>>;
  setOpenDialogPrice: React.Dispatch<SetStateAction<boolean>>;
  setOpenDialogSeason: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setPrice, setOpenDialogPrice, setOpenDialogSeason }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const actions = [
    {
      icon: <EuroIcon />,
      name: 'Rate',
    },
    {
      icon: <DateRangeIcon />,
      name: 'Season',
    },
  ];

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleDialog = (name: string): void => {
    setOpen(false);
    if (name === 'Rate') {
      setPrice(null);
      setOpenDialogPrice(true);
    } else {
      setOpenDialogSeason(true);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="menu"
          className={classes.speedDial}
          hidden={false}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="up"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={(): void => handleDialog(action.name)}
              aria-label={action.name}
            />
          ))}
        </SpeedDial>
      </div>
    </div>
  );
};

export default SpeedDials;
