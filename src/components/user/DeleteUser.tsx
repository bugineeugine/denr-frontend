import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import { ResponseCreateUserType, UserDataType } from "@/types/user";
import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";

type Props = { user: UserDataType } & UseDisclosureType;

const DeleteDialogContent = (props: Props) => {
  const { user, onClose } = props;
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<ResponseCreateUserType, AxiosError<ResponseCreateUserType>>({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/users/${user.id}`);
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

  const handleDelete = async () => {
    await mutateAsync();
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c)",
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
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-200/70 leading-none mb-0.5">
                Destructive Action
              </p>
              <h2 className="text-[16px] font-bold text-white leading-none">Delete User</h2>
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
      </div>

      {/* Body */}
      <DialogContent sx={{ p: 3, background: "#fff" }}>
        <div
          className="rounded-2xl p-4"
          style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}
        >
          <p className="text-[13px] font-bold text-red-800 mb-1">{user.name}</p>
          <p className="text-[11px] text-red-600/70">{user.email}</p>
        </div>
        <div
          className="mt-3 flex items-start gap-3 rounded-2xl p-3"
          style={{ background: "#fff7ed", border: "1.5px solid #fed7aa" }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 16, color: "#c2410c", flexShrink: 0, mt: "1px" }} />
          <p className="text-[12px] leading-relaxed text-orange-800">
            This action is <strong>irreversible</strong>. Once deleted, this user account and all
            associated data cannot be restored.
          </p>
        </div>
      </DialogContent>

      {/* Footer */}
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
          onClick={handleDelete}
          sx={{
            background: "linear-gradient(135deg, #991b1b, #b91c1c)",
            color: "#fff",
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 700,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(185,28,28,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #b91c1c, #dc2626)",
              boxShadow: "0 6px 16px rgba(185,28,28,0.45)",
            },
          }}
        >
          Yes, Delete User
        </Button>
      </DialogActions>
    </div>
  );
};

const DeleteUser = ({ user }: { user: UserDataType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <IconButton
        onClick={disclosure.onOpen}
        size="small"
        sx={{
          color: "#991b1b",
          borderRadius: "8px",
          "&:hover": { background: "#fee2e2" },
        }}
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="delete-user-dialog"
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              overflow: "hidden",
              borderRadius: "20px",
              border: "1.5px solid #fecaca",
              boxShadow: "0 24px 80px rgba(185,28,28,0.18)",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <DeleteDialogContent {...disclosure} user={user} />
      </Dialog>
    </>
  );
};

export default DeleteUser;
