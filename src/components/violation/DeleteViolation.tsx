"use client";

import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import { ViolationDataType } from "@/types/violation";

const DeleteViolation = ({ violation }: { violation: ViolationDataType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/violations/${violation.id}`);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["violation-lists"] });
      customToast(res.message);
      onClose();
    },
    onError: (err: any) => customToast(err?.response?.data?.message || err.message, "error"),
  });

  return (
    <>
      <IconButton size="small" onClick={onOpen} sx={{ color: "#dc2626" }}>
        <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete violation?</DialogTitle>
        <DialogContent>
          <p className="text-sm text-slate-600">
            This will permanently remove the record for{" "}
            <strong>{violation.violator_name}</strong>.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={isPending}
            onClick={() => mutateAsync()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteViolation;
