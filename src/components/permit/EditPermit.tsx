import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";
// @ts-ignore
import "leaflet/dist/leaflet.css";
import { PermitDataType, RequestUpdateType, ResponseUpdatePermitType } from "@/types/permit";
import PermitForm from "./PermitForm";
import { updatePermitSchema } from "@/schema/permitSchema";

const STATUS_STYLE: Record<string, { color: string; bg: string; dot: string }> = {
  Pending:  { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8" },
  Expired:  { color: "#991b1b", bg: "#fee2e2", dot: "#f87171" },
  Rejected: { color: "#92400e", bg: "#fef3c7", dot: "#d97706" },
  Approved: { color: "#14532d", bg: "#dcfce7", dot: "#22c55e" },
};
const getStatus = (s: string) =>
  STATUS_STYLE[s] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };

type Props = { permit: PermitDataType } & UseDisclosureType;

const DialogContentForm = (props: Props) => {
  const { onClose, permit } = props;
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { created_at, updated_at, permit_no, creator, qrcode, status, ...rest } = permit;
  const statusMeta = getStatus(status);

  const methods = useForm({
    defaultValues: { status, ...rest },
    resolver: zodResolver(updatePermitSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation<
    ResponseUpdatePermitType,
    AxiosError<ResponseUpdatePermitType>,
    RequestUpdateType
  >({
    mutationFn: async (body) => {
      const response = await axiosInstance.put(`/permits/${permit.id}`, body);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["permit-lists"] });
      customToast(response.message);
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: RequestUpdateType) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Header */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)",
            padding: "16px 20px",
          }}
        >
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.12]"
            style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }} />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <AssignmentOutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70 leading-none mb-0.5">
                  DENR CENRO
                </p>
                <h2 className="text-[16px] font-bold text-white leading-none">Edit Application</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ background: statusMeta.bg, color: statusMeta.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta.dot }} />
                {status}
              </span>
              <span className="text-[11px] font-mono text-emerald-100/60">{permit_no}</span>
              <IconButton disabled={isPending} onClick={onClose} size="small"
                sx={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", borderRadius: "8px",
                  "&:hover": { background: "rgba(255,255,255,0.18)", color: "#fff" } }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </div>
          </div>
          <div className="relative mt-2">
            <span className="text-[11px] text-emerald-200/60">
              Forest Products Transport Permit — Update the fields below
            </span>
          </div>
        </div>

        {/* Body */}
        <DialogContent sx={{ p: 0, flex: "1 1 0", minHeight: 0, overflow: "auto", background: "#f8fafc" }}>
          <PermitForm action="edit" />
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{
          px: 2.5, py: 2, background: "#fff",
          borderTop: "1.5px solid #e5e7eb", justifyContent: "flex-end", gap: 1,
        }}>
          <Button onClick={onClose} disabled={isPending} sx={{
            border: "1.5px solid #e5e7eb", color: "#64748b", borderRadius: "10px",
            textTransform: "none", fontSize: "0.8rem",
            "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
          }}>
            Cancel
          </Button>
          <Button loading={isPending} type="submit"
            startIcon={<SaveOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              background: "linear-gradient(135deg, #14532d, #166534)", color: "#fff",
              borderRadius: "10px", textTransform: "none", fontSize: "0.8rem",
              fontWeight: 700, px: 2.5, boxShadow: "0 4px 12px rgba(20,83,45,0.35)",
              "&:hover": { background: "linear-gradient(135deg, #166534, #15803d)", boxShadow: "0 6px 16px rgba(20,83,45,0.45)" },
            }}>
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

const EditPermit = ({ permit }: { permit: PermitDataType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small"
        sx={{ color: "#0369a1", borderRadius: "8px", "&:hover": { background: "#e0f2fe" } }}>
        <DriveFileRenameOutlineOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="edit-permit-dialog"
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              overflow: "hidden", borderRadius: "20px",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 24px 80px rgba(20,83,45,0.18)",
              height: "92vh", display: "flex", flexDirection: "column",
            },
          },
        }}
      >
        <DialogContentForm {...disclosure} permit={permit} />
      </Dialog>
    </>
  );
};

export default EditPermit;
