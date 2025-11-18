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

import "leaflet/dist/leaflet.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";

import PermitForm from "./PermitForm";
import { createPermitSchema } from "@/schema/permitSchema";
import { RequestCreateType, ResponseCreatePermitType } from "@/types/permit";
import useAuth from "@/store/useAuth";

const DialogContentForm = (props: UseDisclosureType) => {
  const { onClose } = props;
  const userData = useAuth((state) => state.userData);

  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      permit_type: "",
      land_owner: "",
      contact_no: "",
      location: "",
      area: "",
      species: "",
      total_volume: "",
      plate_no: "",
      destination: "",
      noTruckloads: 0,
      grand_total: "",
      remaning_balance: "",
      verificationFee: 50.0,
      oathFee: 36.0,
      inspectionFee: 360.0,
      totalAmountDue: 0,
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle component={"div"} className="m-0 flex items-center justify-between p-3" id="create-permit-dialog">
          <Typography variant="h6">Add New Permit</Typography>
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

        <DialogContent dividers className="px-0 space-y-2 overflow-auto h-[70vh]">
          <PermitForm />
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

const CreatePermit = () => {
  const disclosure = useDisclosure();
  return (
    <>
      <Button onClick={disclosure.onOpen} variant="contained" startIcon={<AddOutlinedIcon />}>
        Create Permit
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
            className: "overflow-hidden",
          },
        }}
      >
        <DialogContentForm {...disclosure} />
      </Dialog>
    </>
  );
};

export default CreatePermit;
