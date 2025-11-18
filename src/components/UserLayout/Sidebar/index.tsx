import StyledDrawer from './StyledDrawer';
import SideBarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

const SideBar = () => {
  return (
    <StyledDrawer>
      <Toolbar sx={{ minHeight: '56px !important' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <SideBarContent />
        </Box>
        <SidebarFooter />
      </Box>
    </StyledDrawer>
  );
};

export default SideBar;
