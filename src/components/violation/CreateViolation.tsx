"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grow from "@mui/material/Grow";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { violationSchema, ViolationSchemaType } from "@/schema/violationSchema";
import ViolationForm from "./ViolationForm";

const DialogContentForm = ({ onClose }: UseDisclosureType) => {
  const queryClient = useQueryClient();

  const methods = useForm<ViolationSchemaType>({
    defaultValues: {
      violator_name: "",
      contact_number: "",
      location: "",
      violation_type: "Illegal Logging",
      severity: "Low",
      description: "",
      date_recorded: new Date().toISOString().slice(0, 10),
      status: "Open",
      permit_id: "",
    },
    resolver: zodResolver(violationSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (body: ViolationSchemaType) => {
      const payload = { ...body, permit_id: body.permit_id || null };
      const res = await axiosInstance.post(`/violations`, payload);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["violation-lists"] });
      customToast(res.message);
    },
    onError: (err: any) => {
      customToast(err?.response?.data?.message || err.message, "error");
    },
  });

  const onSubmit = async (data: ViolationSchemaType) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          className="relative shrink-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 55%, #b91c1c 100%)", padding: "16px 20px" }}
        >
          <div className="relative flex items-center justify-between gap-3">
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
                <h2 className="text-[16px] font-bold text-white leading-none">Record Violation</h2>
              </div>
            </div>
            <IconButton
              disabled={isPending}
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
        </div>

        <DialogContent sx={{ p: 0, flex: "1 1 0", minHeight: 0, overflow: "auto", background: "#f8fafc" }}>
          <ViolationForm />
        </DialogContent>

        <DialogActions
          sx={{ px: 2.5, py: 2, background: "#fff", borderTop: "1.5px solid #e5e7eb", gap: 1, justifyContent: "space-between" }}
        >
          <p className="text-[11px] text-slate-400">
            Fields marked <span className="font-bold text-red-400">*</span> are required
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={onClose}
              disabled={isPending}
              sx={{
                color: "#64748b",
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "0.8rem",
                border: "1.5px solid #e5e7eb",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Cancel
            </Button>
            <Button
              loading={isPending}
              type="submit"
              startIcon={<SaveOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                background: "linear-gradient(135deg, #991b1b, #b91c1c)",
                color: "#fff",
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "0.8rem",
                fontWeight: 700,
                px: 2.5,
                "&:hover": { background: "linear-gradient(135deg, #b91c1c, #dc2626)" },
              }}
            >
              Record Violation
            </Button>
          </div>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

const CreateViolation = () => {
  const disclosure = useDisclosure();
  return (
    <>
      <Button
        onClick={disclosure.onOpen}
        startIcon={<AddOutlinedIcon sx={{ fontSize: 18 }} />}
        sx={{
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          border: "1.5px solid rgba(255,255,255,0.25)",
          borderRadius: "12px",
          textTransform: "none",
          fontSize: "0.82rem",
          fontWeight: 700,
          px: 2.5,
          py: 1,
          "&:hover": { background: "rgba(255,255,255,0.24)" },
        }}
      >
        Record Violation
      </Button>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              overflow: "hidden",
              borderRadius: "20px",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 24px 80px rgba(127,29,29,0.18)",
              height: "82vh",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <DialogContentForm {...disclosure} />
      </Dialog>
    </>
  );
};

export default CreateViolation;
