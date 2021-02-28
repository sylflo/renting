import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import useCustomSnackbar from '../components/CustomSnackbar/useCustomSnackbar';
import Background from '../assets/images/background.jpg';
import { MUTATION_LOGIN as MUTATION_LOGIN_REQUEST } from '../common/grapql_schemas/admin';

type Auth = {
  email: string;
  password: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const SignInSide: React.ComponentType = () => {
  const { t } = useTranslation();
  const snackbar = useCustomSnackbar();
  const classes = useStyles();
  const [loginRequest] = useMutation(MUTATION_LOGIN_REQUEST, {
    update(
      cache,
      {
        data: {
          login: { accessToken },
        },
      }
    ) {
      localStorage.setItem('token', accessToken);
    },
  });

  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: Auth): Promise<void> => {
    try {
      await loginRequest({
        variables: {
          ...data,
        },
      });
      snackbar.showSuccess(t('You are logged in') as string);
    } catch (err) {
      snackbar.showError(err.message);
    }
  };

  if (localStorage.getItem('token')) {
    return <Redirect to="/" />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        className={classes.image}
        style={{ backgroundImage: `url(${Background})` }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              as={TextField}
              id="email"
              name="email"
              label={t('email')}
              type="text"
              control={control}
              error={!!errors.email}
              helperText={errors.email ? t(errors.email.message) : ''}
              style={{ width: '100%' }}
              defaultValue=""
            />
            <Controller
              as={TextField}
              id="password"
              margin="normal"
              required
              name="password"
              label={t('Password')}
              type="password"
              control={control}
              error={!!errors.password}
              helperText={errors.password ? t(errors.password.message) : ''}
              style={{ width: '100%' }}
              defaultValue=""
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignInSide;
