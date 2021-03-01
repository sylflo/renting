/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { useSnackbar } from 'material-ui-snackbar-provider';

export default function useCustomSnackbar() {
  const snackbar = useSnackbar();
  return React.useMemo(() => {
    const showMessage = (type: string) => (
      message: string,
      action?: string,
      handleAction?: any,
      customParameters?: any
    ) =>
      snackbar.showMessage(message, action, handleAction, {
        ...customParameters,
        type,
      });
    return {
      ...snackbar,
      showMessage: showMessage('info'),
      showInfo: showMessage('info'),
      showWarning: showMessage('warning'),
      showError: showMessage('error'),
      showSuccess: showMessage('success'),
    };
  }, [snackbar]);
}
