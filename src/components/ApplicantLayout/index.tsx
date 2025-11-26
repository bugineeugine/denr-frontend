"use client";
import AppBarContent from "@/components/UserLayout/Appbar/AppbarContent";
import { cn } from "@/utils/utils";
import { Link } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const ApplicantLayout = ({ children }: { children: ReactNode }) => {
  const trigger = false;

  const { push } = useRouter();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="main"
        className="flex flex-1 flex-col min-w-[100px]"
        sx={{
          flexGrow: 1,
        }}
      >
        <AppBar
          position="relative"
          className={cn(
            "transition-all duration-300 ",
            trigger ? "bg-background-paper/70 backdrop-blur-3xl shadow-md  " : "bg-background-paper "
          )}
          variant="outlined"
          color="transparent"
        >
          <Toolbar className={`rounded-md transition-all duration-300 ${trigger ? "px-10" : "px-2"}`}>
            <AppBarContent showBurger />
          </Toolbar>
        </AppBar>
        <AppBar
          position="relative"
          className={cn(
            "mb-2 transition-all duration-300 border-t-0",
            trigger ? "bg-background-paper/70 backdrop-blur-3xl shadow-md  " : "bg-background-paper "
          )}
          variant="outlined"
          color="transparent"
        >
          <Toolbar className={`rounded-md transition-all duration-300 ${trigger ? "px-10" : "px-2"}`}>
            <Box className="flex items-center gap-2">
              <Link
                component={Link}
                onClick={() => push("/home")}
                underline="hover"
                variant="subtitle2"
                className="cursor-pointer"
              >
                Home
              </Link>
              <Link
                className="cursor-pointer"
                onClick={() => push("/application-form")}
                variant="subtitle2"
                underline="hover"
              >
                Apply for Certificate of Verification
              </Link>
              <Link
                className="cursor-pointer"
                onClick={() => push("/citizen-charter")}
                variant="subtitle2"
                underline="hover"
              >
                Citenzen’s Charter
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        {children}
      </Box>
    </Box>
  );
};

export default ApplicantLayout;
