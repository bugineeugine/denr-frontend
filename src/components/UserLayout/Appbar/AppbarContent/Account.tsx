"use client";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { Fragment, useState, MouseEvent, useTransition, useCallback } from "react";
import { logoutAction } from "@/actions/logout";
import useAuth from "@/store/useAuth";
import { stringAvatar } from "@/utils/stringToColor";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema } from "@/schema/userSchema";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";

type UpdateDataType = z.infer<typeof updateSettingsSchema>;

/* ── Settings dialog ─────────────────────────────────────────── */
const Settings = ({
  handleCloseSettings,
  oepnSettings,
}: {
  oepnSettings: boolean;
  handleCloseSettings: () => void;
}) => {
  const userData = useAuth((state) => state.userData);
  const { control, handleSubmit } = useForm({
    defaultValues: { name: userData?.name, email: userData?.email, password: "" },
    resolver: zodResolver(updateSettingsSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation<{ message: string }, AxiosError<{ message: string }>, UpdateDataType>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/settings", data);
      return response.data;
    },
    onSuccess: (response) => customToast(response.message),
    onError: (error) => customToast(error.response?.data.message || error.message, "error"),
  });

  const onSubmit = async (data: UpdateDataType) => {
    if (!data.password) delete data.password;
    await mutateAsync(data);
  };

  return (
    <Dialog
      onClose={handleCloseSettings}
      fullWidth
      maxWidth="xs"
      open={oepnSettings}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "18px",
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 24px 64px rgba(20,83,45,0.12)",
            overflow: "hidden",
          },
        },
      }}
    >
      {/* Dialog header */}
      <div
        className="relative flex items-center gap-3 px-5 py-4"
        style={{
          background: "linear-gradient(135deg, #14532d, #166534)",
          borderBottom: "1.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          <SettingsOutlinedIcon sx={{ fontSize: 16, color: "#fff" }} />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Account Settings
          </p>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: "rgba(167,243,208,0.65)" }}
          >
            Update your profile
          </p>
        </div>
        <button
          onClick={handleCloseSettings}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          {(["name", "email", "password"] as const).map((field) => (
            <FormControl fullWidth key={field}>
              <FormLabel
                sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", mb: 0.5, textTransform: "capitalize" }}
              >
                {field}
              </FormLabel>
              <Controller
                control={control}
                name={field}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <TextField
                    value={value}
                    onChange={onChange}
                    type={field === "password" ? "password" : "text"}
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#166534" },
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          ))}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
          <button
            type="button"
            onClick={handleCloseSettings}
            className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
            style={{ background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e5e7eb" }}
          >
            Cancel
          </button>
          <Button
            loading={isPending}
            variant="contained"
            type="submit"
            sx={{
              flex: 1,
              borderRadius: "10px",
              py: 1.2,
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #14532d, #166534)",
              boxShadow: "0 4px 14px rgba(20,83,45,0.3)",
              "&:hover": { background: "linear-gradient(135deg, #166534, #15803d)" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/* ── Account button + menu ───────────────────────────────────── */
const Account = () => {
  const setUserData = useAuth((state) => state.setUserData);
  const userData = useAuth((state) => state.userData);
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [oepnSettings, setOpenSettings] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const hanldeLogout = () =>
    startTransition(async () => {
      await logoutAction();
      setUserData(null);
    });
  const handleClickOpenSettings = () => {
    handleClose();
    setOpenSettings(true);
  };
  const handleCloseSettings = useCallback(() => setOpenSettings(false), []);

  const fullName = userData?.name ?? "";
  const role = userData?.role ?? "";

  const initials = fullName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <Fragment>
      {/* Avatar trigger */}
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all border border-divider"
        style={{
          background: open ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
        }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar {...stringAvatar(fullName, { width: 28, height: 28, fontSize: 11 })} />
        <div className="hidden sm:flex flex-col leading-tight text-left">
          <span className="text-[12px] font-bold  capitalize">{fullName}</span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">{role}</span>
        </div>
        {/* Chevron */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={2}
          className="ml-1 hidden sm:block transition-transform"
          style={{ width: 12, height: 12, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 220,
              borderRadius: "16px",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 16px 48px rgba(20,83,45,0.12)",
              overflow: "hidden",
              p: 0,
            },
          },
        }}
      >
        {/* User info header */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderBottom: "1px solid #e5e7eb" }}
        >
          <Avatar {...stringAvatar(fullName, { width: 36, height: 36, fontSize: 13 })} />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[13px] font-bold text-slate-800 truncate capitalize">{fullName}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">{role}</span>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1.5">
          <MenuItem
            onClick={handleClickOpenSettings}
            sx={{
              borderRadius: "10px",
              gap: 1.5,
              py: 1,
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#374151",
              "&:hover": { background: "#f0fdf4", color: "#166534" },
            }}
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 17 }} />
            Account Settings
          </MenuItem>

          <Divider sx={{ my: 0.5, borderColor: "#f1f5f9" }} />

          <MenuItem
            onClick={hanldeLogout}
            disabled={isPending}
            sx={{
              borderRadius: "10px",
              gap: 1.5,
              py: 1,
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#991b1b",
              "&:hover": { background: "#fee2e2", color: "#991b1b" },
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 17 }} />
            {isPending ? "Signing out…" : "Sign Out"}
          </MenuItem>
        </div>
      </Menu>

      {oepnSettings && <Settings handleCloseSettings={handleCloseSettings} oepnSettings={oepnSettings} />}
    </Fragment>
  );
};

export default Account;
