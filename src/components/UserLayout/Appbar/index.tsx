import AppBarContent from './AppbarContent';
import StyledAppBar from './StyledAppBar';
import StyledToolBar from './StyledToolBar';

const AppBar = () => {
  return (
    <StyledAppBar>
      <StyledToolBar>
        <AppBarContent />
      </StyledToolBar>
    </StyledAppBar>
  );
};
export default AppBar;
