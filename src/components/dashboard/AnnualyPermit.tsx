"use client";

import { DashboardDatatype } from "@/types/dashboard";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl"
      style={{ background: "#fff", border: "1.5px solid #e5e7eb", minWidth: 130 }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1.5">
        Year {label}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: "#166534" }} />
        <span className="text-[12px] font-semibold text-slate-600">Total</span>
        <span className="text-[13px] font-bold text-slate-800 ml-auto">
          {payload[0].value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default function AnnualyPermit({
  permitByYear,
}: {
  permitByYear: DashboardDatatype["permitsByYear"];
}) {
  const data = permitByYear
    .filter((item) => item.year)
    .map((item) => ({
      year: item.year,
      total: item.total,
    }));

  const total = permitByYear.reduce((acc, item) => acc + item.total, 0);
  const peak  = data.reduce((max, item) => item.total > max ? item.total : max, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
          >
            <BarChartOutlinedIcon sx={{ fontSize: 14, color: "#166534" }} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 block">
              Application Trend Analysis
            </span>
            <span className="text-[10px] text-slate-400">Total permit applications per year</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#166534" }} />
          <span className="text-[11px] font-semibold text-slate-500">Permits</span>
        </div>
      </div>

      {/* Summary strip */}
      <div
        className="flex items-center gap-8 px-5 py-3"
        style={{ borderBottom: "1px solid #f1f5f9" }}
      >
        <div>
          <p className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            {total.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Total recorded</p>
        </div>
        {peak > 0 && (
          <div>
            <p className="text-xl font-bold" style={{ color: "#166534", fontFamily: "'Playfair Display', serif" }}>
              {peak.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Peak year</p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-5" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#166534" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#166534" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeWidth={0.5} stroke="#f1f5f9" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              domain={[0, "dataMax + 1"]}
              allowDecimals={false}
            />
            <Tooltip cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#166534"
              strokeWidth={2.5}
              fill="url(#areaGreen)"
              dot={{ r: 4, fill: "#166534", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#166534", strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
