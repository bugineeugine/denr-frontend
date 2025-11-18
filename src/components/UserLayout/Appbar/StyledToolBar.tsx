'use client';
import { styled } from '@mui/material/styles';

import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar';
import { ReactNode } from 'react';

const MUIToolBar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
  borderBottom: '1px solid',
  borderBottomColor: theme.vars?.palette.divider,
  paddingLeft: `${theme.spacing(2)} !important`,
  paddingRight: `${theme.spacing(2)} !important`,
}));

const StyledToolBar = ({ children }: { children: ReactNode }) => {
  return <MUIToolBar>{children}</MUIToolBar>;
};

export default StyledToolBar;
