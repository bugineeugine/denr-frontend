"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { PermitDataType } from "@/types/permit";
import { exportToExcel, exportToPdf, ReportColumn } from "@/utils/exportReport";

const STATUSES = ["", "Pending", "Approved", "Expired", "Rejected", "Suspended"];

export type PermitReportFilters = {
  from: string;
  to: string;
  status: string;
};

export const emptyFilters: PermitReportFilters = {
  from: "",
  to: "",
  status: "",
};

const reportColumns: ReportColumn<PermitDataType>[] = [
  { header: "Permit No",   accessor: (p) => p.permit_no, width: 18 },
  { header: "Type",        accessor: (p) => p.permit_type, width: 14 },
  { header: "Applicant",   accessor: (p) => p.creator?.name ?? "—", width: 22 },
  { header: "Email",       accessor: (p) => p.creator?.email ?? "—", width: 26 },
  { header: "Status",      accessor: (p) => p.status, width: 12 },
  { header: "Issued",      accessor: (p) => p.issued_date || "—", width: 14 },
  { header: "Expiry",      accessor: (p) => p.expiry_date || "—", width: 14 },
  { header: "Land Owner",  accessor: (p) => p.landOwner ?? "—", width: 22 },
  { header: "Species",     accessor: (p) => p.species ?? "—", width: 18 },
  { header: "Volume",      accessor: (p) => p.estimatedVolumeQuantity ?? "—", width: 12 },
  { header: "Submitted",   accessor: (p) => new Date(p.created_at).toLocaleDateString(), width: 14 },
];

const formatSummary = (f: PermitReportFilters): string => {
  const parts: string[] = [];
  if (f.from || f.to) parts.push(`Date: ${f.from || "—"} to ${f.to || "—"}`);
  if (f.status) parts.push(`Status: ${f.status}`);
  return parts.length ? parts.join(" | ") : "All records";
};

const PermitReportBar = ({
  filters,
  onChange,
  filteredRows,
}: {
  filters: PermitReportFilters;
  onChange: (f: PermitReportFilters) => void;
  filteredRows: PermitDataType[];
}) => {
  const [expanded, setExpanded] = useState(false);

  const update = (k: keyof PermitReportFilters, v: string) =>
    onChange({ ...filters, [k]: v });

  const hasActiveFilter = filters.from || filters.to || filters.status;

  const meta = {
    title: "Permit Applications Report",
    filename: `permits_report_${new Date().toISOString().slice(0, 10)}`,
    filtersSummary: formatSummary(filters),
  };

  return (
    <div
      className="rounded-2xl bg-white mb-3 overflow-hidden"
      style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#f8fafc", borderBottom: expanded ? "1.5px solid #e5e7eb" : "none" }}
      >
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-2"
        >
          <FilterAltOutlinedIcon sx={{ fontSize: 16, color: hasActiveFilter ? "#15803d" : "#64748b" }} />
          <span className="text-[12px] font-bold text-slate-700">Report Filters</span>
          {hasActiveFilter && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: "#dcfce7", color: "#14532d" }}
            >
              Active
            </span>
          )}
          <span className="text-[11px] text-slate-400">
            ({filteredRows.length} match{filteredRows.length !== 1 ? "es" : ""})
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

      {/* Filter inputs */}
      {expanded && (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-4">
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
              onClick={() => onChange(emptyFilters)}
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

export default PermitReportBar;
