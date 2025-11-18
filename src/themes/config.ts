import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
type ThemeConfigType = {
  sideBarCollapsedWidth: number;
  sideBarExpandedWidth: number;
  sideBarCollapsed: boolean;
  sideBarVisibility: boolean;
  mode: 'light' | 'dark';
  defaultIcon: SvgIconComponent;
};

const themeConfig: ThemeConfigType = {
  sideBarCollapsedWidth: 75,
  sideBarExpandedWidth: 230,
  sideBarCollapsed: false,
  sideBarVisibility: false,
  mode: 'light',
  defaultIcon: CircleOutlinedIcon,
};

export default themeConfig;
