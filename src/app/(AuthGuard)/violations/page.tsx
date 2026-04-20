"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { ViolationDataType, ViolationListResponse } from "@/types/violation";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CreateViolation from "@/components/violation/CreateViolation";
import DeleteViolation from "@/components/violation/DeleteViolation";

const SEVERITY_STYLE: Record<string, { color: string; bg: string }> = {
  Low: { color: "#0369a1", bg: "#e0f2fe" },
  Medium: { color: "#92400e", bg: "#fef3c7" },
  High: { color: "#9a3412", bg: "#ffedd5" },
  Critical: { color: "#991b1b", bg: "#fee2e2" },
};

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Open: { color: "#991b1b", bg: "#fee2e2" },
  Investigating: { color: "#92400e", bg: "#fef3c7" },
  Resolved: { color: "#14532d", bg: "#dcfce7" },
  Dismissed: { color: "#475569", bg: "#f1f5f9" },
};

const Pill = ({ value, map }: { value: string; map: Record<string, { color: string; bg: string }> }) => {
  const s = map[value] ?? { color: "#374151", bg: "#f3f4f6" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      {value}
    </span>
  );
};

const ViolationsPage = () => {
  const { data, isLoading } = useQuery<ViolationListResponse>({
    queryKey: ["violation-lists"],
    queryFn: async () => {
      const res = await axiosInstance.get("/violations");
      return res.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<ViolationDataType>[]>(() => [
    {
      accessorKey: "violator_name",
      header: "Violator",
      Cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-bold text-slate-800">{row.original.violator_name}</span>
          <span className="text-[11px] text-slate-400">{row.original.contact_number || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "violation_type",
      header: "Type",
      Cell: ({ row }) => (
        <span className="text-[12px] font-semibold text-slate-700">{row.original.violation_type}</span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      Cell: ({ row }) => (
        <span className="text-[12px] text-slate-600">{row.original.location || "—"}</span>
      ),
    },
    {
      accessorKey: "date_recorded",
      header: "Date",
      size: 110,
      Cell: ({ row }) => (
        <span className="text-[12px] text-slate-600">
          {new Date(row.original.date_recorded).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      filterVariant: "select",
      filterSelectOptions: ["Low", "Medium", "High", "Critical"],
      size: 110,
      Cell: ({ row }) => <Pill value={row.original.severity} map={SEVERITY_STYLE} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      filterVariant: "select",
      filterSelectOptions: ["Open", "Investigating", "Resolved", "Dismissed"],
      size: 130,
      Cell: ({ row }) => <Pill value={row.original.status} map={STATUS_STYLE} />,
    },
    {
      accessorKey: "permit",
      header: "Linked Permit",
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <span className="text-[12px] text-slate-600">
          {row.original.permit?.permit_no || "—"}
        </span>
      ),
    },
    {
      id: "action",
      header: "",
      size: 80,
      Cell: ({ row }) => <DeleteViolation violation={row.original} />,
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: data?.data ?? [],
    enableFilters: true,
    enablePagination: true,
    enableGlobalFilter: true,
    enableTopToolbar: true,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableSorting: true,
    enableColumnResizing: false,
    layoutMode: "grid",
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    state: {
      density: "comfortable",
      isLoading,
      showGlobalFilter: true,
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: "20px", overflow: "hidden", border: "1.5px solid #e5e7eb", background: "#fff" },
    },
    muiTableHeadRowProps: { sx: { background: "#f8fafc", "& th": { borderBottom: "1.5px solid #e5e7eb" } } },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase",
        letterSpacing: "0.1em", color: "#94a3b8", background: "#f8fafc", py: 1.5, px: 2,
      },
    },
    muiTableContainerProps: { sx: { maxHeight: "calc(100vh - 230px)" } },
    muiTableBodyCellProps: { sx: { py: 1.25, px: 2, background: "#fff", borderBottom: "1px solid #f1f5f9" } },
    renderTopToolbar: ({ table }) => (
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
        <div className="relative flex items-center">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8", position: "absolute", left: 10, zIndex: 1 }} />
          <MRT_GlobalFilterTextField
            table={table}
            sx={{
              "& .MuiInputBase-root": {
                paddingLeft: "32px",
                fontSize: "0.8rem",
                background: "#fff",
                borderRadius: "10px",
                border: "1.5px solid #e5e7eb",
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
      <div
        className="relative shrink-0 overflow-hidden px-6 py-5"
        style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 55%, #b91c1c 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <ReportProblemOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-200/70">Compliance</p>
              <h1 className="text-[18px] font-bold leading-tight text-white">Violation Tracking</h1>
            </div>
          </div>
          <CreateViolation />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default ViolationsPage;
