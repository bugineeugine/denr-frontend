"use client";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";

import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";

import { Fragment, useState, MouseEvent, useTransition } from "react";
import { logoutAction } from "@/actions/logout";
import useAuth from "@/store/useAuth";
import { ListItemText } from "@mui/material";
import { stringAvatar } from "@/utils/stringToColor";

const Account = () => {
  const setUserData = useAuth((state) => state.setUserData);
  const userData = useAuth((state) => state.userData);
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const hanldeLogout = async () => {
    startTransition(async () => {
      await logoutAction();
      setUserData(null);
    });
  };

  const fullName = userData?.name || "";
  return (
    <Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sizes="small"
              alt="Full Name"
              {...stringAvatar(fullName, {
                height: 35,
                width: 35,
                fontSize: 15,
              })}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            className: "overflow-visible ",
            sx: {
              "& .MuiMenuItem-root": {
                borderRadius: "var(--mui-shape-borderRadius)",
              },
              p: 0.5,
              width: 200,
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <ListItemText
            primary={fullName}
            slotProps={{
              primary: {
                className: "capitalize",
              },
            }}
          />
        </MenuItem>
        <MenuItem onClick={hanldeLogout} disabled={isPending}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
export default Account;
