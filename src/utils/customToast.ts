import { BaseVariant, enqueueSnackbar } from 'notistack';

export const customToast = (message: string, variant: BaseVariant = 'default') => {
  return enqueueSnackbar(message, {
    autoHideDuration: 2500,
    variant: variant,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
  });
};
