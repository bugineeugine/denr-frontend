"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

type Tone = "danger" | "primary" | "success";

const TONE: Record<Tone, { color: string; bg: string; hover: string }> = {
  danger:  { color: "#fff", bg: "#dc2626", hover: "#b91c1c" },
  primary: { color: "#fff", bg: "linear-gradient(135deg, #14532d, #15803d)", hover: "linear-gradient(135deg, #15803d, #16a34a)" },
  success: { color: "#fff", bg: "#15803d", hover: "#16a34a" },
};

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  const t = TONE[tone];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.2, fontWeight: 700, pb: 1 }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 20, color: tone === "danger" ? "#dc2626" : "#b45309" }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <div className="text-[13px] text-slate-600 leading-relaxed">{message}</div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none", color: "#64748b" }}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          sx={{
            background: t.bg,
            color: t.color,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { background: t.hover },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
