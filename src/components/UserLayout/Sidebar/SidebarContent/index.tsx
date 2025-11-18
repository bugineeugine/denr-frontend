'use client';
import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import Box from '@mui/material/Box';

import menuListItem from './menu-list-item';

import MenuItemList from './MenuItemList';
// import SideBarFooter from './SideBarFooter';

// const secondaryListItems = [
//   { text: 'Settings', icon: <SettingsRoundedIcon /> },
//   { text: 'About', icon: <InfoRoundedIcon /> },
// ];

const SideBarContent = () => {
  return (
    <>
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',

          transition: 'padding 225ms cubic-bezier(0.4, 0, 0.6, 1)',
        }}>
        <Stack
          sx={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <List dense disablePadding>
            <MenuItemList items={menuListItem} />
          </List>

          {/* <List dense disablePadding>
            {secondaryListItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ px: 1 }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </Stack>
      </Box>
      {/* <SideBarFooter /> */}
    </>
  );
};

export default SideBarContent;
