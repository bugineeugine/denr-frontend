"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { DashboardDatatype } from "@/types/dashboard";
import { PermitDataType } from "@/types/permit";
import axiosInstance from "@/utils/axiosInstance";

const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  info:     { color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd" },
  warning:  { color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
  high:     { color: "#b91c1c", bg: "#fee2e2", border: "#fecaca" },
  critical: { color: "#7f1d1d", bg: "#fecaca", border: "#fca5a5" },
};

const STATUS_PILL: Record<string, { color: string; bg: string }> = {
  Pending:   { color: "#0369a1", bg: "#e0f2fe" },
  Approved:  { color: "#14532d", bg: "#dcfce7" },
  Expired:   { color: "#991b1b", bg: "#fee2e2" },
  Rejected:  { color: "#92400e", bg: "#fef3c7" },
  Suspended: { color: "#7f1d1d", bg: "#fecaca" },
};

type AlertDetail = {
  type: string;
  permitNo?: string;
  title: string;
};

type PermitDetailRow = PermitDataType & { days_until_expiry?: number };

const DssPanel = ({ permits }: { permits: DashboardDatatype }) => {
  const alerts = permits.dssAlerts ?? [];
  const top = permits.topViolatorLocations ?? [];
  const [selected, setSelected] = useState<AlertDetail | null>(null);

  const { data, isFetching } = useQuery<{ data: PermitDetailRow[] }>({
    queryKey: ["dss-details", selected?.type, selected?.permitNo],
    queryFn: async () => {
      if (!selected) return { data: [] };
      const url = `/dashboard/dss-details/${selected.type}`;
      const params = selected.permitNo ? { permit_no: selected.permitNo } : {};
      const res = await axiosInstance.get(url, { params });
      return res.data;
    },
    enabled: !!selected,
    retry: false,
  });

  const detailRows = data?.data ?? [];

  const handleAlertClick = (a: NonNullable<DashboardDatatype["dssAlerts"]>[number]) => {
    if (!a.type) return;
    setSelected({
      type: a.type,
      permitNo: a.permit_no,
      title: a.title,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      {/* Alerts */}
      <div
        className="md:col-span-7 rounded-2xl bg-white p-5"
        style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <LightbulbOutlinedIcon sx={{ fontSize: 18, color: "#b45309" }} />
          <h3 className="text-[14px] font-bold text-slate-800">Decision Support Alerts</h3>
        </div>

        {alerts.length === 0 ? (
          <p className="text-[12px] text-slate-400 italic py-6 text-center">
            No active alerts — system status is healthy.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {alerts.map((a, i) => {
              const s = LEVEL_STYLE[a.level] ?? LEVEL_STYLE.info;
              const clickable = !!a.type;
              return (
                <button
                  key={i}
                  onClick={() => clickable && handleAlertClick(a)}
                  disabled={!clickable}
                  className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all"
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    cursor: clickable ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (clickable) (e.currentTarget.style.transform = "translateY(-1px)");
                  }}
                  onMouseLeave={(e) => {
                    if (clickable) (e.currentTarget.style.transform = "translateY(0)");
                  }}
                >
                  <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: s.color, mt: "2px" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold" style={{ color: s.color }}>{a.title}</p>
                    <p className="text-[12px] text-slate-700">{a.message}</p>
                  </div>
                  {clickable && (
                    <ChevronRightRoundedIcon sx={{ fontSize: 18, color: s.color, mt: "2px" }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Top violator locations */}
      <div
        className="md:col-span-5 rounded-2xl bg-white p-5"
        style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "#dc2626" }} />
          <h3 className="text-[14px] font-bold text-slate-800">Top Violator Locations</h3>
        </div>

        {top.length === 0 ? (
          <p className="text-[12px] text-slate-400 italic py-6 text-center">
            No location data yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {top.map((loc, i) => {
              const max = Math.max(...top.map((x) => x.total));
              const pct = (loc.total / max) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] font-semibold text-slate-700 truncate">{loc.location}</span>
                    <span className="text-[12px] font-bold text-rose-700">{loc.total}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-rose-50">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #dc2626, #f87171)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail dialog ───────────────────────────────────────── */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              overflow: "hidden",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
            },
          },
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)",
            borderBottom: "1.5px solid #e5e7eb",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/70">
                DSS Alert Details
              </p>
              <h2 className="text-[15px] font-bold leading-tight text-white truncate">
                {selected?.title ?? ""}
              </h2>
            </div>
          </div>
          <IconButton
            size="small"
            onClick={() => setSelected(null)}
            sx={{
              color: "rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.1)",
              "&:hover": { background: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </div>

        <DialogContent sx={{ p: 0, background: "#f8fafc" }}>
          {isFetching ? (
            <div className="py-12 text-center text-[12px] text-slate-400">Loading…</div>
          ) : detailRows.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-slate-400">
              No matching permits found.
            </div>
          ) : (
            <div className="flex flex-col">
              {detailRows.map((p, i) => {
                const pill = STATUS_PILL[p.status] ?? { color: "#374151", bg: "#f3f4f6" };
                return (
                  <div
                    key={p.id ?? i}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                    style={{
                      background: "#fff",
                      borderBottom: i < detailRows.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-bold text-slate-900">{p.permit_no}</span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: pill.bg, color: pill.color }}
                        >
                          {p.status}
                        </span>
                        {typeof p.days_until_expiry === "number" && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: p.days_until_expiry <= 1 ? "#fee2e2" : "#fef3c7",
                              color: p.days_until_expiry <= 1 ? "#991b1b" : "#92400e",
                            }}
                          >
                            {p.days_until_expiry === 0
                              ? "expires today"
                              : p.days_until_expiry === 1
                              ? "expires tomorrow"
                              : `expires in ${p.days_until_expiry} days`}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-slate-500">
                        <span>{p.creator?.name ?? "—"}</span>
                        <span className="text-slate-300">·</span>
                        <span>{p.creator?.email ?? ""}</span>
                        {p.expiry_date && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span>Expires: <strong className="text-slate-700">{p.expiry_date}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                    <a
                      href={`/permit/${p.permit_no}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition-colors"
                      style={{
                        background: "#f0fdf4",
                        color: "#14532d",
                        border: "1.5px solid #bbf7d0",
                      }}
                    >
                      <OpenInNewOutlinedIcon sx={{ fontSize: 14 }} />
                      View
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, background: "#fff", borderTop: "1.5px solid #e5e7eb" }}>
          <span className="mr-auto text-[11px] font-semibold text-slate-400">
            {detailRows.length} permit{detailRows.length !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={() => setSelected(null)}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DssPanel;
