import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import EuroIcon from '@material-ui/icons/Euro';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
  },
  title: {
    textTransform: 'uppercase',
  },
}));

const TOP_MENU = [
  { name: 'home', link: '/home', icon: <HomeIcon /> },
  { name: 'equipments', link: '/amenities', icon: <MailIcon /> },
  { name: 'restaurants', link: '/restaurants', icon: <RestaurantIcon /> },
  { name: 'activities', link: '/activities', icon: <LocalActivityIcon /> },
];

const BOTTOM_MENU = [
  { name: 'rates', link: '/rates', icon: <EuroIcon /> },
  { name: 'customers', link: '/customers', icon: <EuroIcon /> },
  { name: 'bookings', link: '/bookings', icon: <EuroIcon /> },
];

const MainLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');

  const { t } = useTranslation();
  const location = useLocation();
  useEffect(() => {
    setTitle(location.pathname.substring(1));
  }, [location]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h5" noWrap>
            {t(title)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {TOP_MENU.map((item, index) => (
            <Link className={classes.link} to={item.link} key={item.name}>
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.name)} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          {BOTTOM_MENU.map((item, index) => (
            <Link className={classes.link} to={item.link} key={item.name}>
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.name)} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          <Button
            className={classes.link}
            onClick={(): void => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            <ListItem button>
              <ListItemIcon>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              <ListItemText primary={t('logout')} />
            </ListItem>
          </Button>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
