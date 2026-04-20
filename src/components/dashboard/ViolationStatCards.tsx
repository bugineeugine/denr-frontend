"use client";

import { DashboardDatatype } from "@/types/dashboard";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

const cardStyle = (color: string, bg: string, border: string) => ({
  background: "#fff",
  borderTop: `4px solid ${color}`,
  border: `1px solid ${border}`,
  borderRadius: 16,
});

export default function ViolationStatCards({ permits }: { permits: DashboardDatatype }) {
  const v = permits.violationStats;
  const cards = [
    {
      label: "Total Violations",
      value: v?.total ?? 0,
      icon: ReportProblemOutlinedIcon,
      color: "#dc2626", bg: "#fee2e2", border: "#fecaca",
    },
    {
      label: "Open Cases",
      value: v?.open ?? 0,
      icon: GavelOutlinedIcon,
      color: "#b45309", bg: "#fef3c7", border: "#fde68a",
    },
    {
      label: "Expired Permits",
      value: permits.expiredPermitCount ?? 0,
      icon: EventBusyOutlinedIcon,
      color: "#7c2d12", bg: "#ffedd5", border: "#fed7aa",
    },
    {
      label: "Expiring (30d)",
      value: permits.expiringSoonCount ?? 0,
      icon: ScheduleOutlinedIcon,
      color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} style={cardStyle(c.color, c.bg, c.border)} className="p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <Icon sx={{ fontSize: 20, color: c.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 leading-none mb-1.5"
               style={{ fontFamily: "'Playfair Display', serif" }}>
              {c.value.toLocaleString()}
            </p>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
              {c.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
