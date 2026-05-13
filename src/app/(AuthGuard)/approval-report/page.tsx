"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import axiosInstance from "@/utils/axiosInstance";
import { exportToExcel, exportToPdf, ReportColumn } from "@/utils/exportReport";

type ApprovalReportRow = {
  id: string;
  permit_id: string;
  permit_no: string;
  status: string;
  action: string;
  steps: number;
  created_at: string;
  permit_submitted_at: string | null;
  applicant_name: string | null;
  applicant_email: string | null;
  officer_name: string | null;
  officer_email: string | null;
  officer_position: string | null;
  started_at?: string | null;
};

const formatDuration = (ms: number) => {
  if (!ms || ms < 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0)    return `${days}d ${hours}h`;
  if (hours > 0)   return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const durationMs = (r: ApprovalReportRow): number => {
  const start = r.started_at ?? r.permit_submitted_at;
  if (!start) return 0;
  return new Date(r.created_at).getTime() - new Date(start).getTime();
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const reportColumns: ReportColumn<ApprovalReportRow>[] = [
  { header: "Application No",     accessor: (r) => r.permit_no, width: 18 },
  { header: "Applicant",          accessor: (r) => r.applicant_name ?? "—", width: 22 },
  { header: "Applicant Email",    accessor: (r) => r.applicant_email ?? "—", width: 26 },
  { header: "Designated Officer", accessor: (r) => r.officer_name ?? "—", width: 22 },
  { header: "Officer Position",   accessor: (r) => r.officer_position ?? "—", width: 16 },
  { header: "Action",             accessor: (r) => r.action, width: 28 },
  {
    header: "Started",
    accessor: (r) =>
      r.started_at ?? r.permit_submitted_at
        ? formatDateTime((r.started_at ?? r.permit_submitted_at) as string)
        : "—",
    width: 22,
  },
  {
    header: "Finished",
    accessor: (r) => formatDateTime(r.created_at),
    width: 22,
  },
  {
    header: "Processing Time",
    accessor: (r) => formatDuration(durationMs(r)),
    width: 16,
  },
];

const formatSummary = (permitNo: string, from: string, to: string) => {
  const parts: string[] = [];
  if (permitNo) parts.push(`Permit: ${permitNo}`);
  if (from || to) parts.push(`Date: ${from || "—"} to ${to || "—"}`);
  return parts.length ? parts.join(" | ") : "All approvals";
};

const ApprovalReportPage = () => {
  const [permitNo, setPermitNo] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading } = useQuery<{ data: ApprovalReportRow[] }>({
    queryKey: ["approval-report-all"],
    queryFn: async () => {
      const res = await axiosInstance.get("/citizen-charter/all-approval-report");
      return res.data;
    },
    retry: false,
  });

  // Enrich each row with its "started_at" = previous step's created_at (or permit submission for step 1)
  const enriched = useMemo<ApprovalReportRow[]>(() => {
    const all = data?.data ?? [];
    // Group by permit so we can determine "previous step" per permit
    const byPermit: Record<string, ApprovalReportRow[]> = {};
    all.forEach((r) => {
      (byPermit[r.permit_id] ??= []).push(r);
    });
    // Sort each permit's records by steps ascending
    Object.values(byPermit).forEach((arr) =>
      arr.sort((a, b) => (a.steps ?? 0) - (b.steps ?? 0)),
    );
    // Build a lookup of started_at per record id
    const startedById: Record<string, string | null> = {};
    Object.values(byPermit).forEach((arr) => {
      arr.forEach((r, i) => {
        startedById[r.id] = i === 0 ? r.permit_submitted_at : arr[i - 1].created_at;
      });
    });
    return all.map((r) => ({ ...r, started_at: startedById[r.id] ?? r.permit_submitted_at }));
  }, [data]);

  const filtered = useMemo(() => {
    return enriched.filter((r) => {
      if (permitNo && !r.permit_no.toLowerCase().includes(permitNo.toLowerCase())) return false;
      if (from || to) {
        const created = new Date(r.created_at);
        if (from && created < new Date(from + "T00:00:00")) return false;
        if (to && created > new Date(to + "T23:59:59")) return false;
      }
      return true;
    });
  }, [enriched, permitNo, from, to]);


  const meta = {
    title: "Approval Report",
    filename: `approval_report_${new Date().toISOString().slice(0, 10)}`,
    filtersSummary: formatSummary(permitNo, from, to),
  };

  const reset = () => {
    setPermitNo("");
    setFrom("");
    setTo("");
  };

  const columns = useMemo<MRT_ColumnDef<ApprovalReportRow>[]>(
    () => [
      {
        accessorKey: "permit_no",
        header: "Application No",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "#dcfce7", border: "1px solid #bbf7d0" }}
            >
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14, color: "#166534" }} />
            </div>
            <a
              href={`/permit/${row.original.permit_no}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-bold text-emerald-700 hover:underline"
            >
              {row.original.permit_no}
            </a>
          </div>
        ),
      },
      {
        accessorKey: "applicant_name",
        header: "Applicant",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-slate-700">
              {row.original.applicant_name ?? "—"}
            </span>
            <span className="text-[10.5px] text-slate-400 truncate">
              {row.original.applicant_email ?? ""}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "officer_name",
        header: "Designated Officer",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-slate-700">
              {row.original.officer_name ?? "—"}
            </span>
            <span className="text-[10.5px] text-slate-400 truncate">
              {row.original.officer_position ?? row.original.officer_email ?? ""}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        Cell: ({ row }) => (
          <span className="text-[11.5px] text-slate-600">{row.original.action}</span>
        ),
      },
      {
        id: "started",
        header: "Started",
        size: 200,
        accessorFn: (row) =>
          new Date(row.started_at ?? row.permit_submitted_at ?? row.created_at).getTime(),
        sortingFn: "basic",
        Cell: ({ row }) => {
          const start = row.original.started_at ?? row.original.permit_submitted_at;
          return (
            <div className="flex items-center gap-1.5">
              <AccessTimeRoundedIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
              <span className="text-[12px] text-slate-600">
                {start ? formatDateTime(start) : "—"}
              </span>
            </div>
          );
        },
      },
      {
        id: "finished",
        header: "Finished",
        size: 200,
        accessorFn: (row) => new Date(row.created_at).getTime(),
        sortingFn: "basic",
        Cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <ArrowRightAltRoundedIcon sx={{ fontSize: 14, color: "#15803d" }} />
            <span className="text-[12px] font-semibold text-slate-700">
              {formatDateTime(row.original.created_at)}
            </span>
          </div>
        ),
      },
      {
        id: "duration",
        header: "Processing Time",
        size: 140,
        accessorFn: (row) => durationMs(row),
        sortingFn: "basic",
        Cell: ({ row }) => (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
          >
            <TimerOutlinedIcon sx={{ fontSize: 12 }} />
            {formatDuration(durationMs(row.original))}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: filtered,
    enablePagination: true,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableSorting: true,
    layoutMode: "grid",
    state: { density: "comfortable", isLoading },
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
    muiTableContainerProps: { sx: { maxHeight: "calc(100vh - 360px)" } },
    muiTableBodyCellProps: { sx: { py: 1.25, px: 2, background: "#fff", borderBottom: "1px solid #f1f5f9" } },
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div
        className="relative shrink-0 overflow-hidden px-6 py-5"
        style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)" }}
      >
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <AssessmentOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70">DENR CENRO</p>
              <h1 className="text-[18px] font-bold leading-tight text-white">Reports Application</h1>
              <p className="text-[11px] text-emerald-200/60 mt-0.5">Application approvals with date/time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              startIcon={<GridOnOutlinedIcon sx={{ fontSize: 14 }} />}
              onClick={() => exportToExcel(filtered, reportColumns, meta)}
              disabled={!filtered.length}
              sx={{
                textTransform: "none", fontSize: "0.78rem", fontWeight: 700,
                background: "rgba(255,255,255,0.15)", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "10px", px: 2,
                "&:hover": { background: "rgba(255,255,255,0.25)" },
              }}
            >
              Excel
            </Button>
            <Button
              size="small"
              startIcon={<PictureAsPdfOutlinedIcon sx={{ fontSize: 14 }} />}
              onClick={() => exportToPdf(filtered, reportColumns, meta)}
              disabled={!filtered.length}
              sx={{
                textTransform: "none", fontSize: "0.78rem", fontWeight: 700,
                background: "rgba(255,255,255,0.15)", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "10px", px: 2,
                "&:hover": { background: "rgba(255,255,255,0.25)" },
              }}
            >
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div
        className="shrink-0 grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-4"
        style={{ background: "transparent" }}
      >
        <TextField
          size="small"
          label="Application Number"
          placeholder="e.g. APP-2026-00001"
          value={permitNo}
          onChange={(e) => setPermitNo(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <SearchOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8", mr: 0.8 }} />
              ),
            },
          }}
        />
        <TextField
          type="date"
          label="From"
          size="small"
          fullWidth
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          type="date"
          label="To"
          size="small"
          fullWidth
          value={to}
          onChange={(e) => setTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <div className="flex items-center">
          <IconButton
            onClick={reset}
            disabled={!permitNo && !from && !to}
            sx={{
              color: "#64748b",
              border: "1.5px solid #e5e7eb",
              borderRadius: "10px",
              width: "100%",
              fontSize: "0.78rem",
              gap: 1,
              "&:hover": { background: "#f8fafc" },
            }}
          >
            <RestartAltOutlinedIcon sx={{ fontSize: 16 }} />
            <span className="text-[12px] font-semibold">Reset</span>
          </IconButton>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto px-5 pb-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default ApprovalReportPage;
