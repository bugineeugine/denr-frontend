import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
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
import { UserDialogHeader, UserDialogFooter, dialogPaperSx } from "./CreateUser";

type Props = { user: UserDataType } & UseDisclosureType;

const DialogContentForm = (props: Props) => {
  const { onClose, user } = props;
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      position: user.position,
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
      queryClient.invalidateQueries({ queryKey: ["user-lists"] });
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
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
      >
        <UserDialogHeader
          title="Edit User"
          subtitle={`Updating account for ${user.name}`}
          onClose={onClose}
          isPending={isPending}
        />
        <DialogContent sx={{ p: 2.5, flex: "1 1 0", minHeight: 0, overflow: "auto", background: "#f8fafc" }}>
          <UserForm />
        </DialogContent>
        <UserDialogFooter onClose={onClose} isPending={isPending} submitLabel="Save Changes" />
      </form>
    </FormProvider>
  );
};

const EditUser = ({ user }: { user: UserDataType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <IconButton
        onClick={disclosure.onOpen}
        size="small"
        sx={{
          color: "#0369a1",
          borderRadius: "8px",
          "&:hover": { background: "#e0f2fe" },
        }}
      >
        <DriveFileRenameOutlineOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="edit-user-dialog"
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: dialogPaperSx } }}
      >
        <DialogContentForm {...disclosure} user={user} />
      </Dialog>
    </>
  );
};

export default EditUser;
