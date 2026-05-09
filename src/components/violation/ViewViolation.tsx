"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ViolationDataType } from "@/types/violation";

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Open: { color: "#991b1b", bg: "#fee2e2" },
  Investigating: { color: "#92400e", bg: "#fef3c7" },
  Resolved: { color: "#14532d", bg: "#dcfce7" },
  Dismissed: { color: "#475569", bg: "#f1f5f9" },
};

const Field = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon?: any;
}) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      {Icon && <Icon sx={{ fontSize: 12, color: "#94a3b8" }} />}
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
    </div>
    <p className="text-[13px] font-semibold text-slate-700 break-words">{value || "—"}</p>
  </div>
);

const ViewViolation = ({ violation }: { violation: ViolationDataType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const stat = STATUS_STYLE[violation.status] ?? { color: "#374151", bg: "#f3f4f6" };

  return (
    <>
      <Tooltip title="View details">
        <IconButton size="small" onClick={onOpen} sx={{ color: "#0369a1" }}>
          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              overflow: "hidden",
              borderRadius: "20px",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 24px 80px rgba(127,29,29,0.18)",
            },
          },
        }}
      >
        {/* Header */}
        <div
          className="relative px-6 py-5"
          style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 55%, #b91c1c 100%)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <ReportProblemOutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-200/70 leading-none mb-0.5">
                  Compliance
                </p>
                <h2 className="text-[16px] font-bold text-white leading-none">
                  {violation.violation_type}
                </h2>
              </div>
            </div>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                "&:hover": { background: "rgba(255,255,255,0.18)", color: "#fff" },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={{ background: stat.bg, color: stat.color }}
            >
              {violation.status}
            </span>
          </div>
        </div>

        <DialogContent sx={{ p: 0, background: "#f8fafc" }}>
          <div className="grid grid-cols-2 gap-4 p-5">
            <Field label="Violator" value={violation.violator_name} icon={PersonOutlineOutlinedIcon} />
            <Field label="Contact" value={violation.contact_number} icon={PhoneOutlinedIcon} />
            <Field label="Location" value={violation.location} icon={LocationOnOutlinedIcon} />
            <Field
              label="Date Recorded"
              value={new Date(violation.date_recorded).toLocaleDateString()}
              icon={CalendarTodayOutlinedIcon}
            />
            <Field
              label="Resolved At"
              value={
                violation.resolved_at
                  ? new Date(violation.resolved_at).toLocaleDateString()
                  : null
              }
              icon={CalendarTodayOutlinedIcon}
            />
            <Field
              label="Linked Permit"
              value={violation.permit?.permit_no}
              icon={ArticleOutlinedIcon}
            />
          </div>

          <div className="px-5 pb-5">
            <div
              className="rounded-xl bg-white p-4"
              style={{ border: "1.5px solid #e5e7eb" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                Description
              </p>
              <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                {violation.description}
              </p>
            </div>

            {violation.recorder && (
              <div className="mt-3 text-[11px] text-slate-500">
                Recorded by{" "}
                <strong className="text-slate-700">{violation.recorder.name}</strong>{" "}
                <span className="text-slate-400">({violation.recorder.email})</span>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, background: "#fff", borderTop: "1.5px solid #e5e7eb" }}>
          {violation.permit?.permit_no && (
            <Button
              href={`/permit/${violation.permit.permit_no}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: "none", color: "#15803d", fontWeight: 700 }}
            >
              Open Permit
            </Button>
          )}
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewViolation;
