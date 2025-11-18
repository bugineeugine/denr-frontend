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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { AxiosError } from "axios";
import "leaflet/dist/leaflet.css";
import { PermitDataType, RequestUpdateType, ResponseUpdatePermitType } from "@/types/permit";
import PermitForm from "./PermitForm";
import { updatePermitSchema } from "@/schema/permitSchema";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

type Props = {
  permit: PermitDataType;
} & UseDisclosureType;

const DialogContentForm = (props: Props) => {
  const { onClose, permit } = props;
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { created_at, updated_at, permit_no, creator, qrcode, status, ...rest } = permit;
  const methods = useForm({
    defaultValues: {
      status,
      ...rest,
    },
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
      queryClient.invalidateQueries({
        queryKey: ["permit-lists"],
      });
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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle component={"div"} className="m-0 flex items-center justify-between p-3" id="edit-permit-dialog">
          <Box className="flex flex-col">
            <Typography variant="h6">Edit Permit</Typography>
            <Box className="flex items-center gap-1">
              <Typography variant="subtitle2">{permit_no}</Typography>
              <Chip
                size="small"
                label={status}
                color={
                  status === "Active"
                    ? "info"
                    : status === "Expired"
                      ? "error"
                      : status === "Cancelled"
                        ? "warning"
                        : "primary"
                }
              />
            </Box>
          </Box>
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

        <DialogContent dividers className="px-0 space-y-2 overflow-y-auto overflow-x-hidden h-[70vh]">
          <PermitForm action="edit" />
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

const EditPermit = ({ permit }: { permit: PermitDataType }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small" color="info">
        <DriveFileRenameOutlineOutlinedIcon />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="edit-permit-dialog"
        aria-describedby="edit-permit"
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            className: "overflow-hidden",
          },
        }}
      >
        <DialogContentForm {...disclosure} permit={permit} />
      </Dialog>
    </>
  );
};

export default EditPermit;
