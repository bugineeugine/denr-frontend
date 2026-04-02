import Button from "@mui/material/Button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import "leaflet/dist/leaflet.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";

import PermitForm from "./PermitForm";
import { createPermitSchema } from "@/schema/permitSchema";
import { RequestCreateType, ResponseCreatePermitType } from "@/types/permit";
import useAuth from "@/store/useAuth";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const DialogContentForm = (props: UseDisclosureType) => {
  const { onClose } = props;
  const userData = useAuth((state) => state.userData);

  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      species: "",
      typeForestProduct: "",
      estimatedVolumeQuantity: "",
      typeConveyancePlateNumber: "",
      consignee: "",
      dateOfTransport: "",
      landOwner: "",
      contactNumber: "",
      lng: 121.157227,
      lat: 16.629613,
      requestLetter: undefined,
      certificateBarangay: undefined,
      orCr: undefined,
      driverLicense: undefined,
      otherDocuments: null,
    },
    resolver: zodResolver(createPermitSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation<
    ResponseCreatePermitType,
    AxiosError<ResponseCreatePermitType>,
    RequestCreateType
  >({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/permits`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["permit-lists", { userId: userData?.id }],
      });
      customToast(response.message);
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: RequestCreateType) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", height: "100%" }}>

        {/* ── Dialog header ─────────────────────────────────────────── */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)",
            padding: "16px 20px",
          }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Glow orb */}
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.12]"
            style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }}
          />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <AssignmentOutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70 leading-none mb-0.5">
                  DENR CENRO
                </p>
                <h2 className="text-[16px] font-bold text-white leading-none">
                  New Permit Application
                </h2>
              </div>
            </div>

            <IconButton
              disabled={isPending}
              onClick={onClose}
              size="small"
              aria-label="close"
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

          {/* Sub-label */}
          <div className="relative mt-3 flex items-center gap-2">
            <ForestOutlinedIcon sx={{ fontSize: 13, color: "rgba(74,222,128,0.7)" }} />
            <span className="text-[11px] text-emerald-200/60">
              Forest Products Transport Permit — Complete all required fields
            </span>
          </div>
        </div>

        {/* ── Form body ─────────────────────────────────────────────── */}
        <DialogContent
          sx={{
            p: 0,
            flex: "1 1 0",
            minHeight: 0,
            overflow: "auto",
            background: "#f8fafc",
          }}
        >
          <PermitForm />
        </DialogContent>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <DialogActions
          sx={{
            px: 2.5,
            py: 2,
            background: "#fff",
            borderTop: "1.5px solid #e5e7eb",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <p className="text-[11px] text-slate-400">
            Fields marked <span className="font-bold text-red-400">*</span> are required
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={onClose}
              disabled={isPending}
              sx={{
                borderColor: "#e5e7eb",
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
                background: "linear-gradient(135deg, #14532d, #166534)",
                color: "#fff",
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "0.8rem",
                fontWeight: 700,
                px: 2.5,
                boxShadow: "0 4px 12px rgba(20,83,45,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #166534, #15803d)",
                  boxShadow: "0 6px 16px rgba(20,83,45,0.45)",
                },
              }}
            >
              Submit Application
            </Button>
          </div>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

const CreatePermit = () => {
  const disclosure = useDisclosure();
  return (
    <>
      {/* Trigger button */}
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
          backdropFilter: "blur(8px)",
          "&:hover": {
            background: "rgba(255,255,255,0.24)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
        }}
      >
        New Application
      </Button>

      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="create-permit-dialog"
        aria-describedby="create-permit"
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              overflow: "hidden",
              borderRadius: "20px",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 24px 80px rgba(20,83,45,0.18)",
              height: "92vh",
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

export default CreatePermit;
