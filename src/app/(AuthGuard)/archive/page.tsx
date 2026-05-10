"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { PermitDataType } from "@/types/permit";
import ConfirmDialog from "@/components/ConfirmDialog";

type ArchivedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string | null;
  deleted_at: string;
};

type ConfirmState = {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  tone: "primary" | "danger" | "success";
  onConfirm: () => void;
};

const ArchivePage = () => {
  const [tab, setTab] = useState<"permits" | "users">("permits");
  const queryClient = useQueryClient();
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    tone: "primary",
    onConfirm: () => {},
  });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, open: false }));

  const permitsQ = useQuery({
    queryKey: ["archive", "permits"],
    queryFn: async () => (await axiosInstance.get("/archive/permits")).data,
    enabled: tab === "permits",
    retry: false,
  });

  const usersQ = useQuery({
    queryKey: ["archive", "users"],
    queryFn: async () => (await axiosInstance.get("/archive/users")).data,
    enabled: tab === "users",
    retry: false,
  });

  const restorePermit = useMutation({
    mutationFn: async (id: string) =>
      (await axiosInstance.post(`/archive/permits/${id}/restore`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["archive", "permits"] });
      queryClient.invalidateQueries({ queryKey: ["permit-lists"] });
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const purgePermit = useMutation({
    mutationFn: async (id: string) =>
      (await axiosInstance.delete(`/archive/permits/${id}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["archive", "permits"] });
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const restoreUser = useMutation({
    mutationFn: async (id: string) =>
      (await axiosInstance.post(`/archive/users/${id}/restore`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["archive", "users"] });
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const purgeUser = useMutation({
    mutationFn: async (id: string) =>
      (await axiosInstance.delete(`/archive/users/${id}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["archive", "users"] });
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const permitColumns = useMemo<MRT_ColumnDef<PermitDataType & { deleted_at: string }>[]>(
    () => [
      {
        accessorKey: "permit_no",
        header: "Permit No",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-slate-800">{row.original.permit_no}</span>
            <span className="text-[11px] text-slate-400">{row.original.permit_type}</span>
          </div>
        ),
      },
      {
        accessorKey: "creator.name",
        header: "Applicant",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-slate-700">{row.original.creator?.name}</span>
            <span className="text-[11px] text-slate-400">{row.original.creator?.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Last Status",
        Cell: ({ row }) => (
          <span className="text-[12px] font-semibold text-slate-700">{row.original.status}</span>
        ),
      },
      {
        accessorKey: "deleted_at",
        header: "Archived",
        Cell: ({ row }) => (
          <span className="text-[12px] text-slate-600">
            {row.original.deleted_at ? new Date(row.original.deleted_at).toLocaleString() : "—"}
          </span>
        ),
      },
      {
        id: "action",
        header: "",
        size: 110,
        Cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <Tooltip title="Restore">
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmState({
                    open: true,
                    title: "Restore this permit?",
                    message: (
                      <>
                        Restore <strong>{row.original.permit_no}</strong> back to the active permit list?
                      </>
                    ),
                    confirmLabel: "Restore",
                    tone: "success",
                    onConfirm: () => {
                      restorePermit.mutate(row.original.id);
                      closeConfirm();
                    },
                  })
                }
                sx={{ color: "#15803d" }}
              >
                <RestoreOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete permanently">
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmState({
                    open: true,
                    title: "Permanently delete?",
                    message: (
                      <>
                        Permanently delete <strong>{row.original.permit_no}</strong>? This cannot be undone.
                      </>
                    ),
                    confirmLabel: "Delete forever",
                    tone: "danger",
                    onConfirm: () => {
                      purgePermit.mutate(row.original.id);
                      closeConfirm();
                    },
                  })
                }
                sx={{ color: "#dc2626" }}
              >
                <DeleteForeverOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [restorePermit, purgePermit],
  );

  const userColumns = useMemo<MRT_ColumnDef<ArchivedUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-slate-800">{row.original.name}</span>
            <span className="text-[11px] text-slate-400">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ row }) => (
          <span className="text-[12px] font-semibold text-slate-700 capitalize">{row.original.role}</span>
        ),
      },
      {
        accessorKey: "position",
        header: "Position",
        Cell: ({ row }) => (
          <span className="text-[12px] text-slate-600">{row.original.position || "—"}</span>
        ),
      },
      {
        accessorKey: "deleted_at",
        header: "Archived",
        Cell: ({ row }) => (
          <span className="text-[12px] text-slate-600">
            {new Date(row.original.deleted_at).toLocaleString()}
          </span>
        ),
      },
      {
        id: "action",
        header: "",
        size: 110,
        Cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <Tooltip title="Restore">
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmState({
                    open: true,
                    title: "Restore this user?",
                    message: (
                      <>
                        Restore <strong>{row.original.name}</strong>&apos;s account?
                      </>
                    ),
                    confirmLabel: "Restore",
                    tone: "success",
                    onConfirm: () => {
                      restoreUser.mutate(row.original.id);
                      closeConfirm();
                    },
                  })
                }
                sx={{ color: "#15803d" }}
              >
                <RestoreOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete permanently">
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmState({
                    open: true,
                    title: "Permanently delete?",
                    message: (
                      <>
                        Permanently delete <strong>{row.original.name}</strong>? This cannot be undone.
                      </>
                    ),
                    confirmLabel: "Delete forever",
                    tone: "danger",
                    onConfirm: () => {
                      purgeUser.mutate(row.original.id);
                      closeConfirm();
                    },
                  })
                }
                sx={{ color: "#dc2626" }}
              >
                <DeleteForeverOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [restoreUser, purgeUser],
  );

  const permitTable = useMaterialReactTable({
    columns: permitColumns,
    data: permitsQ.data?.data ?? [],
    enablePagination: true,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableSorting: true,
    enableColumnFilters: false,
    layoutMode: "grid",
    state: { density: "comfortable", isLoading: permitsQ.isLoading },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: "20px", overflow: "hidden", border: "1.5px solid #e5e7eb", background: "#fff" },
    },
    muiTableHeadRowProps: { sx: { background: "#f8fafc" } },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase",
        letterSpacing: "0.1em", color: "#94a3b8", background: "#f8fafc", py: 1.5, px: 2,
      },
    },
    muiTableBodyCellProps: { sx: { py: 1.25, px: 2, borderBottom: "1px solid #f1f5f9" } },
  });

  const userTable = useMaterialReactTable({
    columns: userColumns,
    data: usersQ.data?.data ?? [],
    enablePagination: true,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableSorting: true,
    enableColumnFilters: false,
    layoutMode: "grid",
    state: { density: "comfortable", isLoading: usersQ.isLoading },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: "20px", overflow: "hidden", border: "1.5px solid #e5e7eb", background: "#fff" },
    },
    muiTableHeadRowProps: { sx: { background: "#f8fafc" } },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase",
        letterSpacing: "0.1em", color: "#94a3b8", background: "#f8fafc", py: 1.5, px: 2,
      },
    },
    muiTableBodyCellProps: { sx: { py: 1.25, px: 2, borderBottom: "1px solid #f1f5f9" } },
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className="relative shrink-0 overflow-hidden px-6 py-5"
        style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 55%, #475569 100%)" }}
      >
        <div className="relative flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300/70">Admin only</p>
            <h1 className="text-[18px] font-bold leading-tight text-white">Archive</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 36,
            "& .MuiTab-root": { textTransform: "none", fontSize: "0.78rem", fontWeight: 700, minHeight: 36, color: "#64748b" },
            "& .Mui-selected": { color: "#0f172a" },
            "& .MuiTabs-indicator": { background: "#0f172a", height: 3, borderRadius: 2 },
          }}
        >
          <Tab label="Archived Permits" value="permits" />
          <Tab label="Archived Users" value="users" />
        </Tabs>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        {tab === "permits" ? (
          <MaterialReactTable table={permitTable} />
        ) : (
          <MaterialReactTable table={userTable} />
        )}
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onConfirm={confirmState.onConfirm}
        onClose={closeConfirm}
      />
    </div>
  );
};

export default ArchivePage;
