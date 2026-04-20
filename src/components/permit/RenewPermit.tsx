"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { PermitDataType } from "@/types/permit";

const RenewPermit = ({ permit }: { permit: PermitDataType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/permits/${permit.id}/renew`);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["permit-lists"] });
      customToast(res.message);
      onClose();
    },
    onError: (err: any) => customToast(err?.response?.data?.message || err.message, "error"),
  });

  return (
    <>
      <Tooltip title="Renew permit">
        <IconButton size="small" onClick={onOpen} sx={{ color: "#15803d" }}>
          <AutorenewOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Renew permit?</DialogTitle>
        <DialogContent>
          <p className="text-sm text-slate-600">
            This will copy the data from <strong>{permit.permit_no}</strong> into a new
            application with a fresh number, reset to <em>Pending</em>, and set a new
            1-year expiration. Continue?
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button
            variant="contained"
            disabled={isPending}
            onClick={() => mutateAsync()}
            sx={{
              background: "linear-gradient(135deg, #14532d, #15803d)",
              "&:hover": { background: "linear-gradient(135deg, #15803d, #16a34a)" },
            }}
          >
            Renew
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RenewPermit;
