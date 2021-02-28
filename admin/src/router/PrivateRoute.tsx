/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      render={(props) =>
        localStorage.getItem('token') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default PrivateRoute;
