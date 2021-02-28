/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { Snackbar, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ButtonProps } from '@material-ui/core/Button';
import { SnackbarProps } from '@material-ui/core/Snackbar';

const CustomSnackbar: React.ComponentType<{
  message?: string;
  action?: string;
  ButtonProps?: Partial<ButtonProps>;
  SnackbarProps: Partial<SnackbarProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customParameters: any;
  // eslint-disable-next-line no-shadow
}> = ({ message, action, ButtonProps, SnackbarProps, customParameters }) => {
  return (
    <Snackbar autoHideDuration={6000} {...SnackbarProps}>
      <Alert
        severity={customParameters?.type}
        action={
          action !== '' && (
            <Button color="inherit" size="small" {...ButtonProps}>
              {action}
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

CustomSnackbar.defaultProps = {
  action: '',
  ButtonProps: {},
  message: '',
  customParameters: {},
};

CustomSnackbar.propTypes = {
  message: PropTypes.string,
  action: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  ButtonProps: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  SnackbarProps: PropTypes.object.isRequired,
  customParameters: PropTypes.shape({
    type: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  }),
};

export default CustomSnackbar;
