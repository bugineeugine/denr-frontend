import useAuth from "@/store/useAuth";
import useThemeSettings from "@/themes/useThemeProvider";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const SideBarFooter = () => {
  const userData = useAuth((state) => state.userData);
  const sideBarCollapsed = useThemeSettings((sate) => sate.sideBarCollapsed);

  return (
    <Stack
      direction="row"
      sx={{
        p: 1,
        gap: 1,
        px: 2,
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
        position: "sticky",
        bottom: 0,
        zIndex: 3,
      }}
    >
      <Avatar sizes="small" alt="Full Name" />
      <Box sx={{ mr: "auto" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            lineHeight: "16px",
            textTransform: "capitalize",
            opacity: sideBarCollapsed ? 0 : 1,
            transition: " opacity 0.3s ease-in-out",
          }}
        >
          {userData?.name}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{
            color: "text.secondary",
            opacity: sideBarCollapsed ? 0 : 1,
            transition: " opacity 0.3s ease-in-out",
          }}
        >
          {userData?.email}
        </Typography>
      </Box>
    </Stack>
  );
};

export default SideBarFooter;
