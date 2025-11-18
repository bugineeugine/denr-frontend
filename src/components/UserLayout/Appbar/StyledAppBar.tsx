import MuiAppBar from "@mui/material/AppBar";
import { ReactNode } from "react";
const StyledAppBar = ({ children }: { children: ReactNode }) => {
  return (
    <MuiAppBar
      elevation={0}
      position="fixed"
      sx={{
        transition: "none",
        backgroundColor: "var(--mui-palette-background-paper)",
        borderLeft: "none",
        color: "var(--mui-palette-text-primary)",
        zIndex: "calc(var(--mui-zIndex-drawer) + 1)",
      }}
    >
      {children}
    </MuiAppBar>
  );
};

export default StyledAppBar;
