import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDisclosure, UseDisclosureType } from "@/hooks/useDisclosure";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCitizenCharterSchema } from "@/schema/citizenCharterSchema";
import CitizenCharterForm from "./CitizenCharterForm";
import { RequestCreateCitizenCharter } from "@/types/citizenCharter";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customToast } from "@/utils/customToast";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CreateCitizenCharterContent = ({ disclosure }: { disclosure: UseDisclosureType }) => {
  const methods = useForm({
    defaultValues: {
      type_transaction: "",
      requestLetter: undefined,
      barangayCertification: undefined,
      treeCuttingPermit: undefined,
      orCr: undefined,
      transportAgreement: undefined,
      spa: undefined,
    },
    resolver: zodResolver(createCitizenCharterSchema),
    mode: "all",
  });
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    RequestCreateCitizenCharter
  >({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/citizen-charter`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (response) => {
      customToast(response.message);
      queryClient.invalidateQueries({
        queryKey: ["citizen-charter-lists"],
      });
    },
    onError: (error) => {
      customToast(error.response?.data.message || error.message, "error");
    },
  });

  const onSubmit = async (data: RequestCreateCitizenCharter) => {
    await mutateAsync(data);
    disclosure.onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add New Citizen Charter
        </DialogTitle>
        <IconButton
          aria-label="close"
          disabled={isPending}
          onClick={disclosure.onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <CitizenCharterForm />
        </DialogContent>
        <DialogActions>
          <Button loading={isPending} variant="outlined" onClick={disclosure.onClose}>
            Close
          </Button>
          <Button loading={isPending} variant="contained" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

export default function CreateCitizenCharter() {
  const disclosure = useDisclosure();

  return (
    <>
      <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={disclosure.onOpen}>
        Create Citizen Charter
      </Button>
      <BootstrapDialog maxWidth="sm" fullWidth aria-labelledby="customized-dialog-title" open={disclosure.isOpen}>
        <CreateCitizenCharterContent disclosure={disclosure} />
      </BootstrapDialog>
    </>
  );
}
