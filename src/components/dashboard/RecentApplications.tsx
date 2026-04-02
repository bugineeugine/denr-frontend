"use client";

import { PermitDataType } from "@/types/permit";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

const STATUS_META: Record<string, { color: string; bg: string; dot: string }> = {
  Pending:  { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8" },
  Approved: { color: "#14532d", bg: "#dcfce7", dot: "#22c55e" },
  Expired:  { color: "#991b1b", bg: "#fee2e2", dot: "#f87171" },
  Rejected: { color: "#92400e", bg: "#fef3c7", dot: "#d97706" },
};

const getStatus = (s: string) =>
  STATUS_META[s] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };

function timeAgo(date: Date | string) {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RecentApplications({ permits }: { permits: PermitDataType[] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden h-full"
      style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-2.5 px-5 py-4"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
          >
            <ArticleOutlinedIcon sx={{ fontSize: 14, color: "#166534" }} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Recent Applications
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          {permits.length} records
        </span>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
        {permits.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-[12px] text-slate-400">No applications yet.</p>
          </div>
        ) : (
          permits.map((permit, i) => {
            const meta = getStatus(permit.status);
            const initials = (permit.creator?.name ?? "?")
              .split(" ")
              .map((p) => p[0]?.toUpperCase())
              .slice(0, 2)
              .join("");

            return (
              <div
                key={permit.id}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                style={{
                  borderBottom: i < permits.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                {/* Avatar */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-700 truncate">
                      {permit.permit_no}
                    </span>
                    <span
                      className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
                      {permit.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate">
                    {permit.permit_type} · {permit.creator?.name ?? "—"}
                  </span>
                </div>

                {/* Time */}
                <div className="shrink-0 flex items-center gap-1 text-slate-400">
                  <AccessTimeRoundedIcon sx={{ fontSize: 11 }} />
                  <span className="text-[10px]">{timeAgo(permit.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
