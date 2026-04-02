import { dateFormatter } from "@/utils/dateFormat";
import { stringAvatar } from "@/utils/stringToColor";
import { PermitDataType } from "@/types/permit";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import Avatar from "@mui/material/Avatar";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

const steps = [
  "Receiving/Releasing Clerk — CENRO/Implementing PENRO Records Unit",
  "PENR/CENR Officer / Deputy CENR Officer",
  "Chief RPS (CENRO) / Chief TSD (Implementing PENRO)",
  "CENR Officer / Accountant for Implementing PENRO",
  "Bill Collector / Cashier for Implementing PENRO",
  "Inspection Officer — CENRO/Implementing PENRO",
  "Chief RPS (CENRO) / Chief TSD (Implementing PENRO)",
  "CENR/PENR Office",
  "Receiving/Releasing Clerk — CENRO/Implementing PENRO Records Unit",
];

export interface HistorySteps {
  message: string;
  data: Datum[];
}

export interface Datum {
  id: string;
  permit_id: string;
  action: string;
  approved_by: string;
  steps: number;
  created_at: Date;
  updated_at: Date;
  approver_name: string;
  email: string;
  permit_no: string;
  status: string;
}

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0)    return `${days}d ${hours}h`;
  if (hours > 0)   return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const History = ({ permit }: { permit: PermitDataType }) => {
  const { data } = useQuery<HistorySteps, AxiosError<{ message: string }>>({
    queryKey: ["history-steps", { id: permit.id }],
    queryFn: async () => {
      const res = await axiosInstance.get(`/permits/history/steps/${permit.id}`);
      return res.data;
    },
  });

  const currentStep  = data?.data.length ?? 0;
  const sortedData   = [...(data?.data ?? [])].sort(
    (a, b) => new Date(a.steps).getTime() - new Date(b.steps).getTime(),
  );
  const totalMs =
    sortedData.length > 1
      ? new Date(sortedData[sortedData.length - 1].created_at).getTime() -
        new Date(sortedData[0].created_at).getTime()
      : 0;

  return (
    <div className="flex flex-col">

      {/* Processing time badge */}
      {totalMs > 0 && (
        <div
          className="mx-4 mt-3 mb-1 flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}
        >
          <TimerOutlinedIcon sx={{ fontSize: 13, color: "#4ade80" }} />
          <span className="text-[10px] font-semibold text-emerald-400/80">Total processing time</span>
          <span className="ml-auto text-[11px] font-bold text-emerald-300">{formatDuration(totalMs)}</span>
        </div>
      )}

      {/* Steps */}
      <div className="flex flex-col px-3 pt-2 pb-4">
        {steps.map((label, index) => {
          const record      = sortedData[index];
          const isCompleted = index < currentStep;
          const isCurrent   = index === currentStep;
          const isLast      = index === steps.length - 1;
          const nextRecord  = sortedData[index + 1];

          return (
            <div key={index} className="flex gap-3">
              {/* Track */}
              <div className="flex flex-col items-center" style={{ width: 24, flexShrink: 0 }}>
                {/* Dot */}
                <div className="relative flex items-center justify-center" style={{ marginTop: 14 }}>
                  {isCompleted ? (
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: 18, color: "#4ade80", filter: "drop-shadow(0 0 4px rgba(74,222,128,0.5))" }}
                    />
                  ) : isCurrent ? (
                    <div className="relative flex items-center justify-center">
                      <div
                        className="absolute rounded-full"
                        style={{
                          width: 22,
                          height: 22,
                          background: "rgba(96,165,250,0.15)",
                          animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                        }}
                      />
                      <div
                        className="relative rounded-full"
                        style={{ width: 12, height: 12, background: "#60a5fa", boxShadow: "0 0 8px rgba(96,165,250,0.6)" }}
                      />
                    </div>
                  ) : (
                    <RadioButtonUncheckedRoundedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.15)" }} />
                  )}
                </div>
                {/* Connector */}
                {!isLast && (
                  <div
                    className="flex-1 w-px mt-1"
                    style={{
                      background: isCompleted
                        ? "linear-gradient(to bottom, #4ade80, rgba(74,222,128,0.3))"
                        : "rgba(255,255,255,0.08)",
                      minHeight: 20,
                    }}
                  />
                )}
              </div>

              {/* Content card */}
              <div
                className="flex-1 min-w-0 rounded-xl p-3 mb-2"
                style={{
                  background: isCompleted
                    ? "rgba(74,222,128,0.06)"
                    : isCurrent
                      ? "rgba(96,165,250,0.08)"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    isCompleted ? "rgba(74,222,128,0.15)" : isCurrent ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.06)"
                  }`,
                  marginTop: 6,
                }}
              >
                {/* Step number + label */}
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5"
                    style={{
                      background: isCompleted ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.07)",
                      color: isCompleted ? "#4ade80" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="text-[11px] leading-snug font-medium"
                    style={{ color: isCompleted ? "#d1fae5" : isCurrent ? "#bfdbfe" : "rgba(255,255,255,0.35)" }}
                  >
                    {label}
                  </p>
                </div>

                {/* Approver info */}
                {record ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar
                        {...stringAvatar(record.approver_name, { width: 22, height: 22, fontSize: "0.6rem" })}
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-white/80 truncate">{record.approver_name}</p>
                        <p className="text-[10px] text-white/40 truncate">{record.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 pl-0.5">
                      <div className="flex items-center gap-1">
                        <AccessTimeRoundedIcon sx={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }} />
                        <span className="text-[10px] text-white/35">
                          {dateFormatter(record.created_at.toString(), "MMM DD, YYYY • hh:mm A")}
                        </span>
                      </div>
                      {nextRecord && (
                        <div className="flex items-center gap-1">
                          <AccessTimeRoundedIcon sx={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }} />
                          <span className="text-[10px] text-white/35">
                            → {dateFormatter(nextRecord.created_at.toString(), "MMM DD, YYYY • hh:mm A")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] italic" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {isCurrent ? "Awaiting action…" : "Pending"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default History;
