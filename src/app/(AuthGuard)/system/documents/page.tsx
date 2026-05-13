"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import axiosInstance from "@/utils/axiosInstance";

type DocumentRow = {
  permit_id: string;
  permit_no: string;
  permit_status: string;
  category: string;
  category_key: string;
  filename: string;
  size: number;
  mime: string;
  uploaded_by: string | null;
  uploaded_email: string | null;
  uploaded_at: string;
  exists: boolean;
};

const CATEGORIES = [
  "",
  "Request Letter",
  "Barangay Certificate",
  "OR / CR",
  "Driver's License",
  "Other Documents",
];

const STATUSES = ["", "Pending", "Approved", "Expired", "Rejected", "Suspended"];

const formatSize = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const FileIcon = ({ mime }: { mime: string }) => {
  if (mime.includes("pdf")) return <PictureAsPdfOutlinedIcon sx={{ fontSize: 20, color: "#dc2626" }} />;
  if (mime.startsWith("image/")) return <ImageOutlinedIcon sx={{ fontSize: 20, color: "#0369a1" }} />;
  return <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: "#64748b" }} />;
};

const STATUS_PILL: Record<string, { color: string; bg: string }> = {
  Pending:   { color: "#0369a1", bg: "#e0f2fe" },
  Approved:  { color: "#14532d", bg: "#dcfce7" },
  Expired:   { color: "#991b1b", bg: "#fee2e2" },
  Rejected:  { color: "#92400e", bg: "#fef3c7" },
  Suspended: { color: "#7f1d1d", bg: "#fecaca" },
};

const DocumentArchivePage = () => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [permitNo, setPermitNo] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["document-archive", category, status, permitNo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (status) params.set("status", status);
      if (permitNo.trim()) params.set("q", permitNo.trim());
      const qs = params.toString();
      const res = await axiosInstance.get(`/document-archive${qs ? `?${qs}` : ""}`);
      return res.data;
    },
    retry: false,
  });

  const docsBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents`;

  const openInNewTab = (filename: string) => {
    window.open(`${docsBaseUrl}/${filename}`, "_blank", "noopener,noreferrer");
  };

  const downloadDoc = (row: DocumentRow) => {
    const a = document.createElement("a");
    a.href = `${docsBaseUrl}/${row.filename}`;
    a.download = `${row.permit_no}_${row.category.replace(/\s+/g, "_")}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const rows: DocumentRow[] = data?.data ?? [];

  const columns = useMemo<MRT_ColumnDef<DocumentRow>[]>(
    () => [
      {
        accessorKey: "filename",
        header: "Document",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <FileIcon mime={row.original.mime} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[12.5px] font-bold text-slate-800">{row.original.category}</span>
              <span className="text-[10.5px] text-slate-400 truncate">{row.original.filename}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "permit_no",
        header: "Permit",
        size: 140,
        Cell: ({ row }) => (
          <a
            href={`/permit/${row.original.permit_no}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-emerald-700 hover:underline"
          >
            {row.original.permit_no}
          </a>
        ),
      },
      {
        accessorKey: "permit_status",
        header: "Status",
        size: 110,
        Cell: ({ row }) => {
          const s = STATUS_PILL[row.original.permit_status] ?? { color: "#374151", bg: "#f3f4f6" };
          return (
            <span
              className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold"
              style={{ background: s.bg, color: s.color }}
            >
              {row.original.permit_status}
            </span>
          );
        },
      },
      {
        accessorKey: "uploaded_by",
        header: "Uploaded By",
        Cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-semibold text-slate-700">
              {row.original.uploaded_by ?? "—"}
            </span>
            <span className="text-[10.5px] text-slate-400 truncate">
              {row.original.uploaded_email ?? ""}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "uploaded_at",
        header: "Uploaded",
        size: 140,
        Cell: ({ row }) => (
          <span className="text-[12px] text-slate-600">
            {new Date(row.original.uploaded_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 90,
        Cell: ({ row }) => (
          <span className="text-[12px] text-slate-500">{formatSize(row.original.size)}</span>
        ),
      },
      {
        id: "action",
        header: "",
        size: 130,
        enableSorting: false,
        Cell: ({ row }) =>
          row.original.exists ? (
            <div className="flex items-center gap-0.5">
              <Tooltip title="Open in new tab">
                <IconButton size="small" onClick={() => openInNewTab(row.original.filename)} sx={{ color: "#0369a1" }}>
                  <OpenInNewOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="View permit">
                <IconButton
                  size="small"
                  onClick={() => window.open(`/permit/${row.original.permit_no}`, "_blank")}
                  sx={{ color: "#15803d" }}
                >
                  <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton size="small" onClick={() => downloadDoc(row.original)} sx={{ color: "#7c3aed" }}>
                  <DownloadOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <span className="text-[10.5px] font-bold text-rose-600">file missing</span>
          ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: rows,
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
    muiTableContainerProps: { sx: { maxHeight: "calc(100vh - 300px)" } },
    muiTableBodyCellProps: { sx: { py: 1.25, px: 2, background: "#fff", borderBottom: "1px solid #f1f5f9" } },
    renderTopToolbar: ({ table }) => (
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
      >
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
          {rows.length} document{rows.length !== 1 ? "s" : ""}
        </span>
      </div>
    ),
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
            <FolderCopyOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300/70">System</p>
            <h1 className="text-[18px] font-bold leading-tight text-white">Monitoring Documents</h1>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div
        className="shrink-0 grid grid-cols-1 gap-3 px-5 py-3 sm:grid-cols-3"
        style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}
      >
        <TextField
          size="small"
          label="Search permit number"
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
          select
          size="small"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c || "all"} value={c}>
              {c || "All categories"}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Permit Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
        >
          {STATUSES.map((s) => (
            <MenuItem key={s || "all"} value={s}>
              {s || "All statuses"}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default DocumentArchivePage;
