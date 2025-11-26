import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";

import { useDisclosure } from "@/hooks/useDisclosure";
import Box from "@mui/material/Box";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { CitizenCharterType } from "@/types/citizenCharter";
import { Activity, SyntheticEvent, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";

const ViewCitizenCharter = ({ citizenCharter }: { citizenCharter: CitizenCharterType }) => {
  const disclosure = useDisclosure();

  const [value, setValue] = useState("one");
  const queryClient = useQueryClient();
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.put(`/citizen-charter/${citizenCharter.id}`);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["citizen-lists-approval"],
      });
      customToast(response.message);
    },
    onError: () => {
      customToast("Someting went wrong", "error");
    },
  });

  const handleApprove = async () => {
    await mutateAsync();
    disclosure.onClose();
  };

  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small" color="inherit">
        <RemoveRedEyeOutlinedIcon />
      </IconButton>
      <Dialog
        open={disclosure.isOpen}
        slots={{ transition: Grow }}
        aria-labelledby="edit-permit-dialog"
        aria-describedby="edit-permit"
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            className: "overflow-hidden",
          },
        }}
      >
        <DialogTitle component={"div"} className="m-0 flex items-center justify-between p-3" id="edit-permit-dialog">
          <Box className="flex flex-col">
            <Box className="flex items-center gap-1">
              <Typography variant="subtitle2">{citizenCharter.citizen_no}</Typography>-
              <Typography variant="caption" className="capitalize">
                {citizenCharter.status}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={disclosure.onClose}
            disabled={isPending}
            size="small"
            aria-label="close"
            sx={(theme) => ({
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{citizenCharter.type_transaction}</Typography>
          <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example" variant="scrollable">
            <Tab value="one" label="Request Letter" />
            <Tab value="two" label="Barangay Cerfitication" />
            <Tab value="three" label="Tree Cutting Permit" />
            <Tab value="four" label="ORCR" />
            <Tab value="five" label="Transfort Agreement" />
            <Tab value="six" label="Special Power of Attorne" />
          </Tabs>
          <Activity mode={value === "one" ? "visible" : "hidden"}>
            <Box
              component="iframe"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${citizenCharter.requestLetter}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "100vh" }}
            />
          </Activity>
          <Activity mode={value === "two" ? "visible" : "hidden"}>
            <Box
              component="iframe"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${citizenCharter.barangayCertification}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "100vh" }}
            />
          </Activity>
          <Activity mode={value === "three" ? "visible" : "hidden"}>
            <Box
              component="iframe"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${citizenCharter.treeCuttingPermit}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "100vh" }}
            />
          </Activity>
          <Activity mode={value === "four" ? "visible" : "hidden"}>
            <Box
              component="iframe"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${citizenCharter.orCr}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "100vh" }}
            />
          </Activity>
          <Activity mode={value === "five" ? "visible" : "hidden"}>
            <Box
              component="iframe"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${citizenCharter.transportAgreement}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "100vh" }}
            />
          </Activity>
          <Activity mode={value === "six" ? "visible" : "hidden"}>
            <Box
              component="iframe"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${citizenCharter.spa}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "100vh" }}
            />
          </Activity>
        </DialogContent>
        <DialogActions>
          <Button loading={isPending} onClick={disclosure.onClose} variant="outlined" color="info">
            Close
          </Button>
          <Button loading={isPending} onClick={handleApprove} variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewCitizenCharter;
