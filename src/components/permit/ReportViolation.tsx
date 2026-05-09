"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { ViolationDataType } from "@/types/violation";
import { PermitDataType } from "@/types/permit";

const TYPES = [
  "Illegal Logging",
  "Transport Without Permit",
  "Expired Permit Use",
  "Document Falsification",
  "Other",
];

const emptyForm = {
  violator_name: "",
  contact_number: "",
  location: "",
  violation_type: "Illegal Logging",
  severity: "Medium",
  description: "",
};

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Open: { color: "#991b1b", bg: "#fee2e2" },
  Investigating: { color: "#92400e", bg: "#fef3c7" },
  Resolved: { color: "#14532d", bg: "#dcfce7" },
  Dismissed: { color: "#475569", bg: "#f1f5f9" },
};

const ReportViolation = ({ permit }: { permit: PermitDataType }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: violationsResp } = useQuery({
    queryKey: ["permit-violations", permit.permit_no],
    queryFn: async () => {
      const r = await axiosInstance.get(
        `/violations/public/by-permit-no/${permit.permit_no}`,
      );
      return r.data;
    },
    retry: false,
  });
  const violations: ViolationDataType[] = violationsResp?.data ?? [];

  const update = (k: keyof typeof emptyForm) => (e: any) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/violations/public/report/${permit.permit_no}`,
        form,
      );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["permit-violations", permit.permit_no] });
      customToast(res.message);
      setForm(emptyForm);
      setOpen(false);
    },
    onError: (err: any) =>
      customToast(err?.response?.data?.message || err.message, "error"),
  });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(127,29,29,0.05)" }}
    >
      <div
        className="flex items-center justify-between gap-2.5 px-5 py-3"
        style={{ background: "#fff7ed", borderBottom: "1.5px solid #fed7aa" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #fee2e2, #fef2f2)", border: "1px solid #fecaca" }}
          >
            <ReportProblemOutlinedIcon sx={{ fontSize: 14, color: "#b91c1c" }} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-rose-700">
            Compliance & Violations
          </span>
        </div>
        <Button
          size="small"
          onClick={() => setOpen(true)}
          startIcon={<ReportProblemOutlinedIcon sx={{ fontSize: 14 }} />}
          sx={{
            background: "linear-gradient(135deg, #b91c1c, #dc2626)",
            color: "#fff",
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.72rem",
            fontWeight: 700,
            px: 2,
            "&:hover": { background: "linear-gradient(135deg, #991b1b, #b91c1c)" },
          }}
        >
          Report Violation
        </Button>
      </div>

      <div className="px-5 py-4" style={{ background: "#fafafa" }}>
        {violations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <ReportProblemOutlinedIcon sx={{ fontSize: 28, color: "#cbd5e1" }} />
            <p className="text-[12px] text-slate-400">
              No violations recorded for this permit.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {violations.map((v) => {
              const stat = STATUS_STYLE[v.status] ?? { color: "#374151", bg: "#f3f4f6" };
              return (
                <div
                  key={v.id}
                  className="rounded-xl p-3"
                  style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-slate-800">{v.violation_type}</p>
                      <p className="text-[11px] text-slate-500">
                        {v.violator_name}
                        {v.location ? ` • ${v.location}` : ""}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: stat.bg, color: stat.color }}
                    >
                      {v.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{v.description}</p>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {new Date(v.date_recorded).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Report a Violation</DialogTitle>
        <DialogContent>
          <p className="text-[12px] text-slate-500 mb-3">
            Recording against permit <strong>{permit.permit_no}</strong>.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              size="small"
              label="Violator Name *"
              value={form.violator_name}
              onChange={update("violator_name")}
              fullWidth
            />
            <TextField
              size="small"
              label="Contact Number"
              value={form.contact_number}
              onChange={update("contact_number")}
              fullWidth
            />
            <TextField
              size="small"
              select
              label="Type *"
              value={form.violation_type}
              onChange={update("violation_type")}
              fullWidth
            >
              {TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Location / Barangay"
              value={form.location}
              onChange={update("location")}
              fullWidth
            />
            <div className="sm:col-span-2">
              <TextField
                size="small"
                label="Description *"
                value={form.description}
                onChange={update("description")}
                fullWidth
                multiline
                minRows={3}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isPending || !form.violator_name || !form.description}
            onClick={() => mutateAsync()}
            sx={{
              background: "linear-gradient(135deg, #b91c1c, #dc2626)",
              "&:hover": { background: "linear-gradient(135deg, #991b1b, #b91c1c)" },
            }}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportViolation;
