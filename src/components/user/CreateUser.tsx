import Button from "@mui/material/Button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
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

const DialogContentForm = (props: UseDisclosureType) => {
  const { onClose } = props;
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
      position: null,
    },
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
      queryClient.invalidateQueries({
        queryKey: ["user-lists"],
      });
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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle component={"div"} className="m-0 flex items-center justify-between p-3" id="create-user-dialog">
          <Typography variant="h6">Add New User</Typography>
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
            Save
          </Button>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

const CreateUser = () => {
  const disclosure = useDisclosure();
  return (
    <>
      <Button onClick={disclosure.onOpen} variant="contained" startIcon={<AddOutlinedIcon />}>
        Create User
      </Button>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="create-user-dialog"
        aria-describedby="create-user"
        fullWidth
        maxWidth="sm"
      >
        <DialogContentForm {...disclosure} />
      </Dialog>
    </>
  );
};

export default CreateUser;
