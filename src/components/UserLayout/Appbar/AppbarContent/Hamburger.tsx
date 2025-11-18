"use client";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { useTheme } from "@mui/material/styles";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useMediaQuery } from "@mui/material";
import useThemeSettings from "@/themes/useThemeProvider";

const Hamburger = () => {
  const setCollapseSideBar = useThemeSettings((state) => state.setCollapseSideBar);
  const toggleSideBarVisibility = useThemeSettings((state) => state.toggleSideBarVisibility);
  const sideBarCollapsed = useThemeSettings((state) => state.sideBarCollapsed);
  const sideBarVisibility = useThemeSettings((state) => state.sideBarVisibility);
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const IconComponent =
    sideBarCollapsed && !sideBarVisibility
      ? MenuIcon
      : !sideBarCollapsed && sideBarVisibility
        ? MenuOpenIcon
        : !sideBarCollapsed && !sideBarVisibility && !hidden
          ? MenuOpenIcon
          : MenuIcon;

  return (
    <IconButton
      aria-label="Toggle sidebar visibility"
      color="inherit"
      onClick={hidden ? toggleSideBarVisibility : setCollapseSideBar}
    >
      <IconComponent />
    </IconButton>
  );
};

export default Hamburger;
