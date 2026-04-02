"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardDatatype } from "@/types/dashboard";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const CARDS = (p: DashboardDatatype) => [
  {
    label: "Total Applications",
    value: p.totalPermits,
    icon: AssignmentOutlinedIcon,
    accent: "#14532d",
    accentLight: "#dcfce7",
    accentBorder: "#bbf7d0",
    trend: "All time",
  },
  {
    label: "Submitted Today",
    value: p.permitsToday,
    icon: TodayOutlinedIcon,
    accent: "#0369a1",
    accentLight: "#e0f2fe",
    accentBorder: "#bae6fd",
    trend: "Last 24 hours",
  },
  {
    label: "This Week",
    value: p.permitsThisWeek,
    icon: DateRangeOutlinedIcon,
    accent: "#7c3aed",
    accentLight: "#ede9fe",
    accentBorder: "#ddd6fe",
    trend: "Current week",
  },
  {
    label: "This Month",
    value: p.permitsThisMonth,
    icon: CalendarMonthOutlinedIcon,
    accent: "#b45309",
    accentLight: "#fef3c7",
    accentBorder: "#fde68a",
    trend: "Current month",
  },
];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target]);

  return <>{count.toLocaleString()}</>;
}

export default function StatCards({ permits }: { permits: DashboardDatatype }) {
  const cards = CARDS(permits);

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl bg-white"
            style={{
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              animationDelay: `${i * 80}ms`,
              animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <style>{`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {/* Top accent bar */}
            <div className="h-1 w-full" style={{ background: card.accent }} />

            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: card.accentLight,
                    border: `1px solid ${card.accentBorder}`,
                  }}
                >
                  <Icon sx={{ fontSize: 20, color: card.accent }} />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.15em] rounded-full px-2 py-0.5"
                  style={{ background: card.accentLight, color: card.accent }}
                >
                  {card.trend}
                </span>
              </div>

              <p
                className="text-3xl font-bold leading-none mb-1.5"
                style={{ color: "#0f172a", fontFamily: "'Playfair Display', serif" }}
              >
                <AnimatedCounter target={card.value} />
              </p>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                {card.label}
              </p>
            </div>

            {/* Decorative corner circle */}
            <div
              className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full opacity-[0.06]"
              style={{ background: card.accent }}
            />
          </div>
        );
      })}
    </div>
  );
}
