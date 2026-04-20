"use client";

import { DashboardDatatype } from "@/types/dashboard";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  info: { color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd" },
  warning: { color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
  high: { color: "#b91c1c", bg: "#fee2e2", border: "#fecaca" },
  critical: { color: "#7f1d1d", bg: "#fecaca", border: "#fca5a5" },
};

export default function DssPanel({ permits }: { permits: DashboardDatatype }) {
  const alerts = permits.dssAlerts ?? [];
  const top = permits.topViolatorLocations ?? [];

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
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: s.color, mt: "2px" }} />
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: s.color }}>{a.title}</p>
                    <p className="text-[12px] text-slate-700">{a.message}</p>
                  </div>
                </div>
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
    </div>
  );
}
