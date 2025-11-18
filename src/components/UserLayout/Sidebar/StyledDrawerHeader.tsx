'use client';
import Image from 'next/image';

import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.default,
}));

const StyledDrawerHeader = () => {
  return (
    <MenuHeaderWrapper>
      <Image
        alt="logo"
        width={200}
        height={20}
        priority
        style={{
          width: 'auto',
          height: 'auto',
        }}
        src="/images/BoszxcDev.png"
      />
    </MenuHeaderWrapper>
  );
};

export default StyledDrawerHeader;
