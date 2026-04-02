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
import { createUserSchema } from "@/schema/userSchema";

import { RequestCreateUserType, ResponseCreateUserType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";
import UserForm from "./UserForm";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

/* ── shared dialog header ────────────────────────────────────────────── */
export const UserDialogHeader = ({
  title,
  subtitle,
  onClose,
  isPending,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  isPending: boolean;
}) => (
  <div
    className="relative shrink-0 overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)",
      padding: "16px 20px",
    }}
  >
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
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
          <PersonAddOutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70 leading-none mb-0.5">
            DENR CENRO
          </p>
          <h2 className="text-[16px] font-bold text-white leading-none">{title}</h2>
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
    <div className="relative mt-2">
      <span className="text-[11px] text-emerald-200/60">{subtitle}</span>
    </div>
  </div>
);

/* ── shared dialog footer ────────────────────────────────────────────── */
export const UserDialogFooter = ({
  onClose,
  isPending,
  submitLabel,
}: {
  onClose: () => void;
  isPending: boolean;
  submitLabel: string;
}) => (
  <DialogActions
    sx={{
      px: 2.5,
      py: 2,
      background: "#fff",
      borderTop: "1.5px solid #e5e7eb",
      justifyContent: "flex-end",
      gap: 1,
    }}
  >
    <Button
      onClick={onClose}
      disabled={isPending}
      sx={{
        border: "1.5px solid #e5e7eb",
        color: "#64748b",
        borderRadius: "10px",
        textTransform: "none",
        fontSize: "0.8rem",
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
      {submitLabel}
    </Button>
  </DialogActions>
);

/* ── dialog paper sx ─────────────────────────────────────────────────── */
export const dialogPaperSx = {
  overflow: "hidden",
  borderRadius: "20px",
  border: "1.5px solid #e5e7eb",
  boxShadow: "0 24px 80px rgba(20,83,45,0.18)",
  display: "flex",
  flexDirection: "column" as const,
  height: "80vh",
};

/* ── create dialog ───────────────────────────────────────────────────── */
const DialogContentForm = (props: UseDisclosureType) => {
  const { onClose } = props;
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: { name: "", email: "", role: "", password: "", position: null },
    resolver: zodResolver(createUserSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation<
    ResponseCreateUserType,
    AxiosError<ResponseCreateUserType>,
    RequestCreateUserType
  >({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/users`, body);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
      customToast(response.message);
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: RequestCreateUserType) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
      >
        <UserDialogHeader
          title="Create New User"
          subtitle="Fill in the details below to register a new system account."
          onClose={onClose}
          isPending={isPending}
        />
        <DialogContent sx={{ p: 2.5, flex: "1 1 0", minHeight: 0, overflow: "auto", background: "#f8fafc" }}>
          <UserForm />
        </DialogContent>
        <UserDialogFooter onClose={onClose} isPending={isPending} submitLabel="Create User" />
      </form>
    </FormProvider>
  );
};

const CreateUser = () => {
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
          backdropFilter: "blur(8px)",
          "&:hover": {
            background: "rgba(255,255,255,0.24)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
        }}
      >
        Create User
      </Button>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="create-user-dialog"
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: dialogPaperSx } }}
      >
        <DialogContentForm {...disclosure} />
      </Dialog>
    </>
  );
};

export default CreateUser;
