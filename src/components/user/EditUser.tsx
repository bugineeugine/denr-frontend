import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/schema/userSchema";

import { RequestUpdateUserType, ResponseCreateUserType, UserDataType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";
import UserForm from "./UserForm";

type Props = {
  user: UserDataType;
} & UseDisclosureType;

const DialogContentForm = (props: Props) => {
  const { onClose, user } = props;
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    },
    resolver: zodResolver(updateUserSchema),
    mode: "all",
  });

  const { mutateAsync, isPending } = useMutation<
    ResponseCreateUserType,
    AxiosError<ResponseCreateUserType>,
    RequestUpdateUserType
  >({
    mutationFn: async (body) => {
      const response = await axiosInstance.put(`/users/${user.id}`, body);
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
  const onSubmit = async (data: RequestUpdateUserType) => {
    const { password, ...rest } = data;

    const payload = password ? { ...rest, password } : rest;

    await mutateAsync(payload);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle component={"div"} className="m-0 flex items-center justify-between p-3" id="create-user-dialog">
          <Typography variant="h6">Edit User</Typography>
          <IconButton
            disabled={isPending}
            onClick={onClose}
            size="small"
            aria-label="close"
            sx={(theme) => ({
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="py-2 space-y-2">
          <UserForm />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} loading={isPending} variant="outlined" color="info">
            Cancel
          </Button>
          <Button loading={isPending} type="submit" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

const EditUser = ({ user }: { user: UserDataType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small" color="info">
        <DriveFileRenameOutlineOutlinedIcon />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="create-user-dialog"
        aria-describedby="create-user"
        fullWidth
        maxWidth="sm"
      >
        <DialogContentForm {...disclosure} user={user} />
      </Dialog>
    </>
  );
};

export default EditUser;
