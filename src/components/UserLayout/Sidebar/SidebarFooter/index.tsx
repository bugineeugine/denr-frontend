"use client";

import useThemeSettings from "@/themes/useThemeProvider";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const SidebarFooter = () => {
  const sideBarCollapsed = useThemeSettings((state) => state.sideBarCollapsed);
  const currentYear = new Date().getFullYear();
  const appVersion = "v1.0.0";

  return (
    <Box
      sx={{
        mt: "auto",
        py: 1.5,
        px: sideBarCollapsed ? 0 : 2,
        borderTop: "1px solid var(--mui-palette-divider)",
        textAlign: "center",
        transition: "all 0.3s ease",
      }}
    >
      {sideBarCollapsed ? (
        <Tooltip title={`Version ${appVersion} © ${currentYear}`}>
          <Typography variant="caption" color="text.secondary">
            ©
          </Typography>
        </Tooltip>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" display="block">
            {appVersion}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © {currentYear} DENR
          </Typography>
        </>
      )}
    </Box>
  );
};

export default SidebarFooter;
