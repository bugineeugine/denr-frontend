"use client";

import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

import { dateFromNow } from "@/utils/dateFormat";
import { PermitDataType, PermitListsType } from "@/types/permit";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

/* ── status config ───────────────────────────────────────────────────── */
const STATUS_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
  Pending:  { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8" },
  Expired:  { color: "#991b1b", bg: "#fee2e2", dot: "#f87171" },
  Rejected: { color: "#92400e", bg: "#fef3c7", dot: "#d97706" },
  Approved: { color: "#14532d", bg: "#dcfce7", dot: "#22c55e" },
};
const getStatus = (s: string) =>
  STATUS_STYLE[s] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };

/* ── sub-components ──────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: string }) => {
  const s = getStatus(status);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl"
      style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0" }}>
      <InboxOutlinedIcon sx={{ fontSize: 28, color: "#166534" }} />
    </div>
    <div className="text-center">
      <p className="text-[15px] font-bold text-slate-700">No approval history yet</p>
      <p className="mt-1 text-[13px] text-slate-400">Applications you have approved will appear here.</p>
    </div>
  </div>
);

/* ── page ────────────────────────────────────────────────────────────── */
const HistoryApprovePage = () => {
  const { data, isLoading } = useQuery<PermitListsType>({
    queryKey: ["history-approved"],
    queryFn: async () => {
      const response = await axiosInstance.get("/citizen-charter/history-approved");
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<PermitDataType>[]>(
    () => [
      {
        accessorKey: "permit_no",
        header: "Application",
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "#dcfce7", border: "1px solid #bbf7d0" }}>
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14, color: "#166534" }} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold tracking-wide text-slate-800">
                {row.original.permit_no}
              </span>
              <span className="text-[11px] text-slate-400">{row.original.permit_type ?? "—"}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: false,
        Cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "created_at",
        header: "Approved",
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <AccessTimeRoundedIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
            <span className="text-[12px] text-slate-600">
              {dateFromNow(row.original.created_at as unknown as string)}
            </span>
          </div>
        ),
      },
    ],
    [],
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
    state: { density: "comfortable", isLoading, showGlobalFilter: true },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: "20px", overflow: "hidden", border: "1.5px solid #e5e7eb", background: "#fff" },
    },
    muiTableHeadRowProps: {
      sx: { background: "#f8fafc", "& th": { borderBottom: "1.5px solid #e5e7eb" } },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase",
        letterSpacing: "0.1em", color: "#94a3b8", background: "#f8fafc", py: 1.5, px: 2,
      },
    },
    muiTableContainerProps: { sx: { maxHeight: "calc(100vh - 230px)" } },
    muiTableBodyCellProps: {
      sx: { py: 1.25, px: 2, background: "#fff", borderBottom: "1px solid #f1f5f9" },
    },
    muiTableBodyRowProps: {
      sx: {
        transition: "background 0.15s",
        "&:hover td": { background: "#f8fafc" },
        "&:last-child td": { borderBottom: "none" },
      },
    },
    muiBottomToolbarProps: { sx: { background: "#f8fafc", borderTop: "1.5px solid #e5e7eb" } },
    renderEmptyRowsFallback: () => <EmptyState />,
    renderTopToolbar: ({ table }) => (
      <div className="flex items-center gap-3 px-4 py-3"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
        <div className="relative flex items-center">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8", position: "absolute", left: 10, zIndex: 1 }} />
          <MRT_GlobalFilterTextField table={table} sx={{
            "& .MuiInputBase-root": {
              paddingLeft: "32px", fontSize: "0.8rem", background: "#fff",
              borderRadius: "10px", border: "1.5px solid #e5e7eb",
              "&:hover": { borderColor: "#bbf7d0" },
              "&.Mui-focused": { borderColor: "#166534", boxShadow: "0 0 0 3px rgba(22,101,52,0.1)" },
            },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          }} />
        </div>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {data?.data?.length ?? 0} record{data?.data?.length !== 1 ? "s" : ""}
        </span>
      </div>
    ),
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="relative shrink-0 overflow-hidden px-6 py-5"
        style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)" }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }} />
        <div className="relative flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <HistoryOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70">DENR CENRO</p>
            <h1 className="text-[18px] font-bold leading-tight text-white">Approval History</h1>
            <p className="text-[11px] text-emerald-200/60 mt-0.5">Applications you have approved</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default HistoryApprovePage;
