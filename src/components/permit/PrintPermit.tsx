import { PermitDataType } from "@/types/permit";

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
const PrintPermit = ({ permit }: { permit: PermitDataType }) => {
  const handlePrint = async () => {
    const response = await axios.get("/api/print/" + permit.permit_no, {
      responseType: "blob",
    });
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  return (
    <IconButton size="small" color="info" onClick={handlePrint}>
      <LocalPrintshopOutlinedIcon />
    </IconButton>
  );
};

export default PrintPermit;
