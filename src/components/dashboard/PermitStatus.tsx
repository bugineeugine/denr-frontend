"use client";

import { DashboardDatatype } from "@/types/dashboard";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  Pending:  { color: "#0369a1", bg: "#e0f2fe", label: "Pending" },
  Approved: { color: "#14532d", bg: "#dcfce7", label: "Approved" },
  Expired:  { color: "#991b1b", bg: "#fee2e2", label: "Expired" },
  Rejected: { color: "#92400e", bg: "#fef3c7", label: "Rejected" },
};

const getColor = (s: string) => STATUS_META[s]?.color ?? "#64748b";
const getBg    = (s: string) => STATUS_META[s]?.bg    ?? "#f1f5f9";

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { status: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const color = getColor(entry.payload.status);
  return (
    <div
      className="rounded-xl px-3 py-2.5 shadow-lg text-sm"
      style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="text-[12px] font-bold" style={{ color }}>{entry.payload.status}</span>
      </div>
      <p className="text-[13px] font-bold text-slate-800 mt-1">{entry.value.toLocaleString()} permits</p>
    </div>
  );
};

export default function PermitStatus({
  permitsByStatus,
}: {
  permitsByStatus: DashboardDatatype["permitsByStatus"];
}) {
  const total = permitsByStatus.reduce((acc, s) => acc + s.total, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden h-full"
      style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-4"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
      >
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
        >
          <DonutLargeOutlinedIcon sx={{ fontSize: 14, color: "#166534" }} />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 block">
            Status Distribution
          </span>
          <span className="text-[10px] text-slate-400">Breakdown by current status</span>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Donut */}
        <div className="relative flex items-center justify-center" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={permitsByStatus}
                dataKey="total"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                strokeWidth={0}
              >
                {permitsByStatus.map((entry) => (
                  <Cell key={entry.status} fill={getColor(entry.status)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {total.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Total</p>
          </div>
        </div>

        {/* Legend rows */}
        <div className="flex flex-col gap-2">
          {permitsByStatus.map((item) => {
            const color = getColor(item.status);
            const bg = getBg(item.status);
            const pct = total > 0 ? ((item.total / total) * 100).toFixed(1) : "0";
            return (
              <div key={item.status} className="flex items-center gap-3">
                {/* Bar track */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                      <span className="text-[11px] font-semibold text-slate-600">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700">{item.total}</span>
                      <span
                        className="text-[10px] font-bold rounded-full px-1.5 py-0.5"
                        style={{ background: bg, color }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: "#f1f5f9" }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
