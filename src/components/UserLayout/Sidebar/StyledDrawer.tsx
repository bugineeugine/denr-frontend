"use client";

import themeConfig from "@/themes/config";
import useThemeSettings from "@/themes/useThemeProvider";
import MuiSwipeableDrawer, { SwipeableDrawerProps } from "@mui/material/SwipeableDrawer";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useEffect } from "react";

const MUISwipeableDrawer = styled(MuiSwipeableDrawer)<SwipeableDrawerProps>(() => ({
  overflowX: "hidden",
  transition: "width .40s ease-in-out",

  "& .MuiDrawer-paper": {
    left: "unset",
    right: "unset",
    overflowX: "hidden",
    transition: "width .40s ease-in-out, box-shadow .40s ease-in-out",
  },
}));

const StyledDrawer = ({ children }: { children: ReactNode }) => {
  const sideBarCollapsed = useThemeSettings((state) => state.sideBarCollapsed);
  const sideBarVisibility = useThemeSettings((state) => state.sideBarVisibility);

  const setSideBarVisibility = useThemeSettings((state) => state.setSideBarVisibility);
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const segments = useSelectedLayoutSegments();

  const MobileDrawerProps = {
    open: sideBarVisibility,
    onOpen: () => setSideBarVisibility(true),
    onClose: () => setSideBarVisibility(false),
    ModalProps: {
      keepMounted: true,
    },
  };

  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
  };

  useEffect(() => {
    useThemeSettings.setState({ activeMenu: segments });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MUISwipeableDrawer
      variant={hidden ? "temporary" : "permanent"}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      slotProps={{
        paper: {
          sx: {
            width: sideBarCollapsed ? themeConfig.sideBarCollapsedWidth : themeConfig.sideBarExpandedWidth,
            maxWidth: 500,
          },
        },
      }}
      sx={{
        width: sideBarCollapsed ? themeConfig.sideBarCollapsedWidth : themeConfig.sideBarExpandedWidth,
        maxWidth: 500,
      }}
    >
      {children}
    </MUISwipeableDrawer>
  );
};

export default StyledDrawer;
