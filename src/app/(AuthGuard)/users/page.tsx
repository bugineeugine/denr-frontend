"use client";

import Avatar from "@mui/material/Avatar";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { UserDataType, UserListsType } from "@/types/user";

import CreateUser from "@/components/user/CreateUser";
import EditUser from "@/components/user/EditUser";
import DeleteUser from "@/components/user/DeleteUser";
import useAuth from "@/store/useAuth";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

/* ── role config ─────────────────────────────────────────────────────── */
const ROLE_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
  admin:     { color: "#7c3aed", bg: "#ede9fe", dot: "#a78bfa" },
  validator: { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8" },
  officer:   { color: "#166534", bg: "#dcfce7", dot: "#4ade80" },
};
const getRole = (r: string) =>
  ROLE_STYLE[r] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };

/* ── avatar color from name ──────────────────────────────────────────── */
const nameToColor = (name: string) => {
  const colors = ["#14532d", "#166534", "#0369a1", "#7c3aed", "#b45309", "#0f766e"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) =>
  name.split(" ").map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");

/* ── role badge ──────────────────────────────────────────────────────── */
const RoleBadge = ({ role }: { role: string }) => {
  const s = getRole(role);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {role}
    </span>
  );
};

/* ── empty state ─────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl"
      style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0" }}
    >
      <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "#166534" }} />
    </div>
    <div className="text-center">
      <p className="text-[15px] font-bold text-slate-700">No users registered yet</p>
      <p className="mt-1 text-[13px] text-slate-400">
        Use the <strong className="text-slate-600">Create User</strong> button to add the first account.
      </p>
    </div>
  </div>
);

/* ── main page ───────────────────────────────────────────────────────── */
const UsersPage = () => {
  const useData = useAuth((state) => state.userData);

  const { data, isLoading } = useQuery<UserListsType>({
    queryKey: ["user-lists"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<UserDataType>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        Cell: ({ row }) => {
          const name = row.original.name;
          const bg = nameToColor(name);
          return (
            <div className="flex items-center gap-3">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  background: bg,
                  flexShrink: 0,
                }}
              >
                {getInitials(name)}
              </Avatar>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-bold text-slate-800 truncate">{name}</span>
                <span className="text-[11px] text-slate-400 truncate">{row.original.position ?? "—"}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        Cell: ({ row }) => (
          <span className="text-[12px] text-slate-600">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        id: "action",
        header: "",
        size: 80,
        Cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-0.5">
              {useData?.id !== user.id && <EditUser user={user} />}
              {useData?.id !== user.id && <DeleteUser user={user} />}
            </div>
          );
        },
      },
    ],
    [useData],
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data ?? [],
    enableFilters: true,
    enablePagination: true,
    enableBottomToolbar: true,
    enableGlobalFilter: true,
    enableTopToolbar: true,
    enableColumnActions: false,
    enableStickyHeader: true,
    manualSorting: false,
    enableSorting: true,
    manualPagination: false,
    enableRowActions: false,
    enableColumnResizing: false,
    layoutMode: "grid",
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableFilterMatchHighlighting: false,
    state: {
      density: "comfortable",
      isLoading,
      showGlobalFilter: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "20px",
        overflow: "hidden",
        border: "1.5px solid #e5e7eb",
        background: "#fff",
      },
    },
    muiTableHeadRowProps: {
      sx: { background: "#f8fafc", "& th": { borderBottom: "1.5px solid #e5e7eb" } },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700,
        fontSize: "0.68rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#94a3b8",
        background: "#f8fafc",
        py: 1.5,
        px: 2,
      },
    },
    muiTableContainerProps: {
      sx: { maxHeight: "calc(100vh - 230px)" },
    },
    muiTableBodyCellProps: {
      sx: {
        py: 1.25,
        px: 2,
        background: "#fff",
        borderBottom: "1px solid #f1f5f9",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        transition: "background 0.15s",
        "&:hover td": { background: "#f8fafc" },
        "&:last-child td": { borderBottom: "none" },
      },
    },
    muiBottomToolbarProps: {
      sx: { background: "#f8fafc", borderTop: "1.5px solid #e5e7eb" },
    },
    renderEmptyRowsFallback: () => <EmptyState />,
    renderTopToolbar: ({ table }) => (
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
      >
        <div className="relative flex items-center">
          <SearchOutlinedIcon
            sx={{ fontSize: 16, color: "#94a3b8", position: "absolute", left: 10, zIndex: 1 }}
          />
          <MRT_GlobalFilterTextField
            table={table}
            sx={{
              "& .MuiInputBase-root": {
                paddingLeft: "32px",
                fontSize: "0.8rem",
                background: "#fff",
                borderRadius: "10px",
                border: "1.5px solid #e5e7eb",
                "&:hover": { borderColor: "#bbf7d0" },
                "&.Mui-focused": {
                  borderColor: "#166534",
                  boxShadow: "0 0 0 3px rgba(22,101,52,0.1)",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          />
        </div>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {data?.data?.length ?? 0} user{data?.data?.length !== 1 ? "s" : ""}
        </span>
      </div>
    ),
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div
        className="relative shrink-0 overflow-hidden px-6 py-5"
        style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <PeopleAltOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70">
                DENR CENRO
              </p>
              <h1 className="text-[18px] font-bold leading-tight text-white">User Management</h1>
            </div>
          </div>
          <CreateUser />
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default UsersPage;
