/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { SnackbarProvider } from 'material-ui-snackbar-provider';
import App from './App';
import * as serviceWorker from './serviceWorker';
import CustomSnackbar from './components/CustomSnackbar/CustomSnackbar';
import './index.css';
import './i18n';

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:4000/',
});

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.render(
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <SnackbarProvider SnackbarComponent={CustomSnackbar as any}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </SnackbarProvider>
  </LocalizationProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
