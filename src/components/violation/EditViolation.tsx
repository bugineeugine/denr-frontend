"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { ViolationDataType } from "@/types/violation";

const STATUSES = ["Open", "Investigating", "Resolved", "Dismissed"];

const EditViolation = ({ violation }: { violation: ViolationDataType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    status: violation.status,
    description: violation.description,
  });

  const update = (k: keyof typeof form) => (e: any) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put(`/violations/${violation.id}`, form);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["violation-lists"] });
      queryClient.invalidateQueries({
        queryKey: ["permit-violations", violation.permit?.permit_no],
      });
      customToast(res.message);
      onClose();
    },
    onError: (err: any) =>
      customToast(err?.response?.data?.message || err.message, "error"),
  });

  return (
    <>
      <Tooltip title="Edit / Update status">
        <IconButton size="small" onClick={onOpen} sx={{ color: "#15803d" }}>
          <EditOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Update Violation
          <p className="text-[11px] font-normal text-slate-400 mt-0.5">
            {violation.violator_name} · {violation.violation_type}
          </p>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-3 pt-2">
            <TextField
              size="small"
              select
              label="Status *"
              value={form.status}
              onChange={update("status")}
              fullWidth
            >
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Description / Investigation Notes"
              value={form.description}
              onChange={update("description")}
              fullWidth
              multiline
              minRows={4}
            />
          </div>
          {form.status === "Resolved" && (
            <p className="mt-3 text-[11px] text-emerald-700">
              Resolution date will be set to today automatically.
            </p>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button
            variant="contained"
            disabled={isPending}
            onClick={() => mutateAsync()}
            sx={{
              background: "linear-gradient(135deg, #14532d, #15803d)",
              "&:hover": { background: "linear-gradient(135deg, #15803d, #16a34a)" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditViolation;
