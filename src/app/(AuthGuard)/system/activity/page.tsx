"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import axiosInstance from "@/utils/axiosInstance";

type ActivityLog = {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_role: string | null;
  action: string;
  subject_type: string;
  subject_id: string | null;
  subject_label: string | null;
  changes: Record<string, { from: any; to: any }> | null;
  ip_address: string | null;
  created_at: string;
};

const ACTION_STYLE: Record<string, { color: string; bg: string }> = {
  created:   { color: "#14532d", bg: "#dcfce7" },
  updated:   { color: "#0369a1", bg: "#e0f2fe" },
  deleted:   { color: "#92400e", bg: "#fef3c7" },
  archived:  { color: "#92400e", bg: "#fef3c7" },
  restored:  { color: "#14532d", bg: "#dcfce7" },
  purged:    { color: "#991b1b", bg: "#fee2e2" },
  "backup.created":  { color: "#1e3a8a", bg: "#dbeafe" },
  "backup.restored": { color: "#7c2d12", bg: "#ffedd5" },
  "backup.deleted":  { color: "#991b1b", bg: "#fee2e2" },
};

const shortType = (t: string) => {
  if (t.startsWith("App\\Models\\")) return t.replace("App\\Models\\", "");
  return t;
};

const ActivityLogsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => (await axiosInstance.get("/activity-logs?limit=300")).data,
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<ActivityLog>[]>(() => [
    {
      accessorKey: "created_at",
      header: "Time",
      size: 170,
      Cell: ({ row }) => (
        <span className="text-[12px] text-slate-600">
          {new Date(row.original.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "user_name",
      header: "User",
      Cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-[12.5px] font-semibold text-slate-800">{row.original.user_name || "system"}</span>
          <span className="text-[10.5px] text-slate-400 capitalize">{row.original.user_role || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      size: 130,
      filterVariant: "select",
      Cell: ({ row }) => {
        const s = ACTION_STYLE[row.original.action] ?? { color: "#374151", bg: "#f3f4f6" };
        return (
          <span
            className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize"
            style={{ background: s.bg, color: s.color }}
          >
            {row.original.action}
          </span>
        );
      },
    },
    {
      accessorKey: "subject_type",
      header: "Resource",
      Cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">{shortType(row.original.subject_type)}</span>
          <span className="text-[11px] text-slate-400">{row.original.subject_label ?? row.original.subject_id ?? "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "ip_address",
      header: "IP",
      size: 130,
      Cell: ({ row }) => (
        <span className="text-[12px] text-slate-500">{row.original.ip_address || "—"}</span>
      ),
    },
    {
      accessorKey: "changes",
      header: "Changes",
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const c = row.original.changes;
        if (!c) return <span className="text-[11px] text-slate-400">—</span>;
        const keys = Object.keys(c);
        if (keys.length === 0) return <span className="text-[11px] text-slate-400">—</span>;
        return (
          <span className="text-[11px] text-slate-600">
            {keys.slice(0, 3).join(", ")}{keys.length > 3 ? ` +${keys.length - 3} more` : ""}
          </span>
        );
      },
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: data?.data ?? [],
    enablePagination: true,
    enableGlobalFilter: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: true,
    enableSorting: true,
    layoutMode: "grid",
    state: { density: "comfortable", isLoading, showGlobalFilter: true },
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
            <ManageHistoryOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300/70">System</p>
            <h1 className="text-[18px] font-bold leading-tight text-white">Activity Logs</h1>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default ActivityLogsPage;
