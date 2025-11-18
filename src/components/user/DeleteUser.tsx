import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import { ResponseCreateUserType, UserDataType } from "@/types/user";
import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
type Props = {
  user: UserDataType;
} & UseDisclosureType;

const DeleteDialogContent = (props: Props) => {
  const { user, onClose } = props;
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<ResponseCreateUserType, AxiosError<ResponseCreateUserType>>({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/users/${user.id}`);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["user-lists"],
      });
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
    <>
      <DialogTitle variant="subtitle1" fontWeight="bold" id="delete-certificate-dialog">
        Are you sure you want to delete this user?
      </DialogTitle>
      <IconButton
        disabled={isPending}
        onClick={onClose}
        aria-label="close"
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="py-0">
        <Typography>{user.name}</Typography>
        <Alert icon={false} severity="error" color="error" className="mt-2">
          This action is <strong>irreversible</strong>. Once deleted, this user cannot be restored.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button loading={isPending} onClick={onClose} variant="outlined" color="info" aria-label="cancel-button">
          Cancel
        </Button>
        <Button loading={isPending} onClick={handleDelete} color="error" variant="contained" aria-label="delete-button">
          Yes, Delete
        </Button>
      </DialogActions>
    </>
  );
};

const DeleteUser = ({ user }: { user: UserDataType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small" color="error">
        <DeleteOutlineOutlinedIcon />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="create-user-dialog"
        aria-describedby="create-user"
        fullWidth
        maxWidth="sm"
      >
        <DeleteDialogContent {...disclosure} user={user} />
      </Dialog>
    </>
  );
};

export default DeleteUser;
