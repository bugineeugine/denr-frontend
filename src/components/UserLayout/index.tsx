import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SideBar from "./Sidebar";
import AppBar from "./Appbar";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box className="flex relative ">
      <AppBar />
      <SideBar />
      <Box className="flex flex-1 flex-col min-w-[100px]">
        <Toolbar
          sx={{
            minHeight: "56px !important",
          }}
        />
        {children}
      </Box>
    </Box>
  );
};

export default UserLayout;
