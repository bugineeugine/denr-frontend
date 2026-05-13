"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { ViolationDataType } from "@/types/violation";
import { exportToExcel, exportToPdf, ReportColumn } from "@/utils/exportReport";

const STATUSES = ["", "Open", "Investigating", "Resolved", "Dismissed"];

export type ViolationReportFilters = {
  from: string;
  to: string;
  status: string;
  permitNo: string;
};

export const emptyViolationFilters: ViolationReportFilters = {
  from: "",
  to: "",
  status: "",
  permitNo: "",
};

const reportColumns: ReportColumn<ViolationDataType>[] = [
  { header: "Permit No",         accessor: (v) => v.permit?.permit_no ?? "—", width: 18 },
  { header: "Violator",          accessor: (v) => v.violator_name, width: 22 },
  { header: "Contact",           accessor: (v) => v.contact_number ?? "—", width: 14 },
  { header: "Vehicle Plate",     accessor: (v) => v.vehicle_plate ?? "—", width: 14 },
  { header: "Violation Type",    accessor: (v) => v.violation_type, width: 22 },
  { header: "Location",          accessor: (v) => v.location ?? "—", width: 22 },
  { header: "Status",            accessor: (v) => v.status, width: 14 },
  { header: "Recorded By",       accessor: (v) => v.recorder?.name ?? "—", width: 22 },
  { header: "Last Updated By",   accessor: (v) => v.updater?.name ?? "—", width: 22 },
  {
    header: "Date Recorded",
    accessor: (v) => new Date(v.date_recorded).toLocaleDateString(),
    width: 14,
  },
  {
    header: "Resolved Date",
    accessor: (v) => (v.resolved_at ? new Date(v.resolved_at).toLocaleDateString() : "—"),
    width: 14,
  },
  { header: "Description", accessor: (v) => v.description ?? "—", width: 30 },
];

const formatSummary = (f: ViolationReportFilters): string => {
  const parts: string[] = [];
  if (f.permitNo) parts.push(`Permit: ${f.permitNo}`);
  if (f.from || f.to) parts.push(`Date: ${f.from || "—"} to ${f.to || "—"}`);
  if (f.status) parts.push(`Status: ${f.status}`);
  return parts.length ? parts.join(" | ") : "All violations";
};

const ViolationReportBar = ({
  filters,
  onChange,
  filteredRows,
}: {
  filters: ViolationReportFilters;
  onChange: (f: ViolationReportFilters) => void;
  filteredRows: ViolationDataType[];
}) => {
  const [expanded, setExpanded] = useState(false);

  const update = (k: keyof ViolationReportFilters, v: string) =>
    onChange({ ...filters, [k]: v });

  const hasActiveFilter =
    filters.from || filters.to || filters.status || filters.permitNo;

  const meta = {
    title: "Violations Report",
    filename: `violations_report_${new Date().toISOString().slice(0, 10)}`,
    filtersSummary: formatSummary(filters),
  };

  return (
    <div
      className="rounded-2xl bg-white mb-3 overflow-hidden"
      style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 8px rgba(127,29,29,0.04)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#f8fafc", borderBottom: expanded ? "1.5px solid #e5e7eb" : "none" }}
      >
        <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-2">
          <FilterAltOutlinedIcon sx={{ fontSize: 16, color: hasActiveFilter ? "#b91c1c" : "#64748b" }} />
          <span className="text-[12px] font-bold text-slate-700">Report Filters</span>
          {hasActiveFilter && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: "#fee2e2", color: "#991b1b" }}
            >
              Active
            </span>
          )}
          <span className="text-[11px] text-slate-400">
            ({filteredRows.length} record{filteredRows.length !== 1 ? "s" : ""})
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <Button
            size="small"
            startIcon={<GridOnOutlinedIcon sx={{ fontSize: 14 }} />}
            onClick={() => exportToExcel(filteredRows, reportColumns, meta)}
            disabled={!filteredRows.length}
            sx={{
              textTransform: "none",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#14532d",
              border: "1.5px solid #bbf7d0",
              borderRadius: "10px",
              px: 1.5,
              "&:hover": { background: "#f0fdf4", borderColor: "#86efac" },
            }}
          >
            Excel
          </Button>
          <Button
            size="small"
            startIcon={<PictureAsPdfOutlinedIcon sx={{ fontSize: 14 }} />}
            onClick={() => exportToPdf(filteredRows, reportColumns, meta)}
            disabled={!filteredRows.length}
            sx={{
              textTransform: "none",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#991b1b",
              border: "1.5px solid #fecaca",
              borderRadius: "10px",
              px: 1.5,
              "&:hover": { background: "#fef2f2", borderColor: "#fca5a5" },
            }}
          >
            PDF
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-5">
          <TextField
            size="small"
            label="Permit Number"
            placeholder="e.g. APP-2026-00001"
            value={filters.permitNo}
            onChange={(e) => update("permitNo", e.target.value)}
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
            value={filters.from}
            onChange={(e) => update("from", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type="date"
            label="To"
            size="small"
            fullWidth
            value={filters.to}
            onChange={(e) => update("to", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            select
            label="Status"
            size="small"
            fullWidth
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s || "all"} value={s}>
                {s || "All"}
              </MenuItem>
            ))}
          </TextField>
          <div className="flex items-center">
            <IconButton
              onClick={() => onChange(emptyViolationFilters)}
              disabled={!hasActiveFilter}
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
      )}
    </div>
  );
};

export default ViolationReportBar;
