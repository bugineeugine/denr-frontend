"use client";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";

import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";

import { Fragment, useState, MouseEvent, useTransition, useCallback } from "react";
import { logoutAction } from "@/actions/logout";
import useAuth from "@/store/useAuth";
import { stringAvatar } from "@/utils/stringToColor";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema } from "@/schema/userSchema";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";

type UpdateDataType = z.infer<typeof updateSettingsSchema>;

const Settings = ({
  handleCloseSettings,
  oepnSettings,
}: {
  oepnSettings: boolean;
  handleCloseSettings: () => void;
}) => {
  const userData = useAuth((state) => state.userData);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      password: "",
    },
    resolver: zodResolver(updateSettingsSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation<{ message: string }, AxiosError<{ message: string }>, UpdateDataType>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/settings", data);
      return response.data;
    },

    onSuccess: (response) => {
      customToast(response.message);
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: UpdateDataType) => {
    if (!data.password) {
      delete data.password;
    }
    await mutateAsync(data);
  };

  return (
    <>
      <Dialog onClose={handleCloseSettings} fullWidth aria-labelledby="customized-dialog-title" open={oepnSettings}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Settings
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IconButton
            disabled={isPending}
            aria-label="close"
            onClick={handleCloseSettings}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers className="space-y-2">
            <FormControl fullWidth>
              <FormLabel>Name</FormLabel>
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                  return <TextField value={value} onChange={onChange} error={!!error} helperText={error?.message} />;
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Email</FormLabel>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                  return <TextField value={value} onChange={onChange} error={!!error} helperText={error?.message} />;
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Password</FormLabel>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                  return <TextField value={value} onChange={onChange} error={!!error} helperText={error?.message} />;
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button loading={isPending} variant="contained" type="submit">
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

const Account = () => {
  const setUserData = useAuth((state) => state.setUserData);
  const userData = useAuth((state) => state.userData);
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [oepnSettings, setOpenSettings] = useState(false);

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
  const handleClickOpenSettings = () => {
    setOpenSettings(true);
  };
  const handleCloseSettings = useCallback(() => {
    setOpenSettings(false);
  }, []);
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
        <MenuItem onClick={handleClickOpenSettings}>
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
      {oepnSettings && <Settings handleCloseSettings={handleCloseSettings} oepnSettings={oepnSettings} />}
    </Fragment>
  );
};
export default Account;
