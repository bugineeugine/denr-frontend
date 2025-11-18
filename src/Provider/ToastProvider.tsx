'use client';

import { SnackbarProvider } from 'notistack';
import { ReactNode } from 'react';

const ToastProvider = ({ children }: { children: ReactNode }) => {
  return <SnackbarProvider>{children}</SnackbarProvider>;
};

export default ToastProvider;
