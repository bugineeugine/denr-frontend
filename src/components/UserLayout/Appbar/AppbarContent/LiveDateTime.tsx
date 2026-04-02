"use client";

import { useEffect, useState } from "react";

const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const date = dateTime.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = dateTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 border border-divider mr-2">
      {/* Calendar dot */}
      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#4ade80" }} />

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">{date}</span>
        <span
          className="text-[13px] font-bold tabular-nums"
          style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
        >
          {time}
        </span>
      </div>
    </div>
  );
};

export default LiveDateTime;
