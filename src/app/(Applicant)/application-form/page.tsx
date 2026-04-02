"use client";

import CreatePermit from "@/components/permit/CreatePermit";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

import { PermitListsType, PermitDataType } from "@/types/permit";
import useAuth from "@/store/useAuth";

import PermitDrawer from "@/components/permit/PermitDrawer";
import PrintPermit from "@/components/permit/PrintPermit";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

/* ── status config ──────────────────────────────────────────────────── */
const STATUS_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
  Pending:  { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8" },
  Expired:  { color: "#991b1b", bg: "#fee2e2", dot: "#f87171" },
  Rejected: { color: "#92400e", bg: "#fef3c7", dot: "#d97706" },
  Approved: { color: "#14532d", bg: "#dcfce7", dot: "#22c55e" },
};
const getStatus = (s: string) =>
  STATUS_STYLE[s] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };

/* ── progress config ─────────────────────────────────────────────────── */
const TOTAL_STEPS = 9;

/* ── empty state ─────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        border: "1.5px solid #bbf7d0",
      }}
    >
      <ForestOutlinedIcon sx={{ fontSize: 28, color: "#166534" }} />
    </div>
    <div className="text-center">
      <p className="text-[15px] font-bold text-slate-700">No permit applications yet</p>
      <p className="mt-1 text-[13px] text-slate-400">
        Submit your first request using the <strong className="text-slate-600">New Application</strong> button above.
      </p>
    </div>
  </div>
);

/* ── status badge ────────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: string }) => {
  const s = getStatus(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
};

/* ── progress bar ────────────────────────────────────────────────────── */
const ProgressBar = ({ steps }: { steps: number }) => {
  const pct = Math.min((steps / TOTAL_STEPS) * 100, 100);
  const isComplete = steps >= TOTAL_STEPS;
  return (
    <div className="flex items-center gap-2" style={{ minWidth: 120 }}>
      <div
        className="relative h-1.5 flex-1 overflow-hidden rounded-full"
        style={{ background: "#e5e7eb" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: isComplete
              ? "linear-gradient(90deg, #16a34a, #22c55e)"
              : "linear-gradient(90deg, #166534, #4ade80)",
          }}
        />
      </div>
      <span
        className="shrink-0 text-[10px] font-bold tabular-nums"
        style={{ color: isComplete ? "#16a34a" : "#64748b" }}
      >
        {steps}/{TOTAL_STEPS}
      </span>
    </div>
  );
};

/* ── QR stamp ────────────────────────────────────────────────────────── */
const QrStamp = ({ src }: { src: string }) => (
  <div
    className="relative overflow-hidden"
    style={{
      width: 38,
      height: 38,
      borderRadius: 8,
      border: "1.5px solid #d1fae5",
      background: "#f0fdf4",
      padding: 2,
      boxShadow: "0 1px 4px rgba(20,83,45,0.12)",
    }}
  >
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="QR"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5, display: "block" }}
      />
    ) : (
      <div
        className="flex h-full w-full items-center justify-center rounded"
        style={{ background: "#d1fae5" }}
      >
        <span style={{ fontSize: 10, color: "#166534", fontWeight: 800 }}>QR</span>
      </div>
    )}
  </div>
);

/* ── main page ───────────────────────────────────────────────────────── */
const ApplicationForm = () => {
  const userData = useAuth((state) => state.userData);

  const { data, isLoading } = useQuery<PermitListsType>({
    queryKey: ["permit-lists", { userId: userData?.id }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/permits/${userData?.id}`);
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<PermitDataType>[]>(
    () => [
      {
        accessorKey: "qrcode",
        header: "",
        size: 56,
        enableSorting: false,
        Cell: ({ row }) => (
          <QrStamp
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${row.original.qrcode}`}
          />
        ),
      },
      {
        accessorKey: "permit_no",
        header: "Application No.",
        size: 160,
        Cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-bold tracking-wide text-slate-800">
              {row.original.permit_no}
            </span>
            <span className="text-[11px] text-slate-400">{row.original.permit_type}</span>
          </div>
        ),
      },
      {
        accessorKey: "expiry_date",
        header: "Validity",
        Cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-semibold text-slate-700">
              {row.original.issued_date ?? "—"}
            </span>
            <span className="text-[11px] text-slate-400">
              until {row.original.expiry_date ?? "—"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status_step",
        header: "Current Step",
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <span className="line-clamp-2 max-w-[180px] text-[11px] leading-snug text-slate-500">
            {row.original.status_step ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "steps",
        header: "Progress",
        enableColumnFilter: false,
        size: 140,
        Cell: ({ row }) => <ProgressBar steps={row.original.steps} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 110,
        Cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "action",
        header: "",
        size: 80,
        Cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            {row.original.status === "Approved" && <PrintPermit permit={row.original} />}
            <PermitDrawer permit={row.original} />
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
      sx: {
        background: "#f8fafc",
        "& th": { borderBottom: "1.5px solid #e5e7eb" },
      },
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
                "&.Mui-focused": { borderColor: "#166534", boxShadow: "0 0 0 3px rgba(22,101,52,0.1)" },
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          />
        </div>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {data?.data?.length ?? 0} record{data?.data?.length !== 1 ? "s" : ""}
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
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Decorative circle */}
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
              <AssignmentOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70">
                DENR CENRO
              </p>
              <h1 className="text-[18px] font-bold leading-tight text-white">My Applications</h1>
            </div>
          </div>

          <CreatePermit />
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default ApplicationForm;
