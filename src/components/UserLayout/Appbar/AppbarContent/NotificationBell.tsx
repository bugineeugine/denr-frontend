"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { NotificationListResponse, AppNotificationType } from "@/types/notification";

const SEVERITY_DOT: Record<string, string> = {
  info: "#0ea5e9",
  success: "#16a34a",
  warning: "#d97706",
  critical: "#dc2626",
};

const formatRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery<NotificationListResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },
    refetchInterval: 60_000,
    retry: false,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAll = useMutation({
    mutationFn: async () => axiosInstance.put(`/notifications/read-all`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = data?.data?.notifications ?? [];
  const unread = data?.data?.unreadCount ?? 0;

  const handleClick = (n: AppNotificationType) => {
    if (!n.read_at) markRead.mutate(n.id);
    if (n.link) router.push(n.link);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "#fff", mr: 1 }}
        aria-label="notifications"
      >
        <Badge
          badgeContent={unread}
          color="error"
          max={99}
          slotProps={{ badge: { sx: { fontSize: "0.6rem", height: 16, minWidth: 16 } } }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              mt: 1.2,
              width: 360,
              maxHeight: 480,
              borderRadius: "14px",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
            },
          },
        }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
          <span className="text-[13px] font-bold text-slate-700">Notifications</span>
          {unread > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllOutlinedIcon sx={{ fontSize: 14 }} />}
              onClick={() => markAll.mutate()}
              sx={{ textTransform: "none", fontSize: "0.72rem", color: "#166534" }}
            >
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 && (
          <div className="px-4 py-10 text-center text-[12px] text-slate-400">
            No notifications yet
          </div>
        )}

        {notifications.map((n, i) => (
          <div key={n.id}>
            <MenuItem
              onClick={() => handleClick(n)}
              sx={{
                py: 1.2,
                px: 2,
                whiteSpace: "normal",
                alignItems: "flex-start",
                background: n.read_at ? "transparent" : "#f0fdf4",
                "&:hover": { background: "#f8fafc" },
              }}
            >
              <span
                className="mt-1.5 mr-2 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ background: SEVERITY_DOT[n.severity] ?? "#94a3b8" }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-bold text-slate-800 truncate">{n.title}</div>
                <div className="text-[11.5px] text-slate-500 line-clamp-2">{n.message}</div>
                <div className="mt-0.5 text-[10px] text-slate-400">{formatRelative(n.created_at)}</div>
              </div>
            </MenuItem>
            {i < notifications.length - 1 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
          </div>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;
