import { createPermitSchema, permitSchema, updatePermitSchema } from "@/schema/permitSchema";
import * as z from "zod";
import { DataResponseType } from ".";
export type PermitListsType = {
  message: string;
  data: PermitDataType[];
};

export type RequestCreateType = z.infer<typeof createPermitSchema>;
export type RequestUpdateType = z.infer<typeof updatePermitSchema>;
export type PermitSchemaType = z.infer<typeof permitSchema>;
export type ResponseCreatePermitType = DataResponseType<"data">;
export type ResponseUpdatePermitType = DataResponseType<"data">;
export type PermitDataType = {
  id: string;
  permit_type: string;
  permit_no: string;
  typeForestProduct: string;
  estimatedVolumeQuantity: string;
  typeConveyancePlateNumber: string;
  consignee: string;
  estimated_volume?: string | null;
  quantity_pcs?: string | null;
  type_conveyance?: string | null;
  plate_number?: string | null;
  consignee_name?: string | null;
  destination?: string | null;
  dateOfTransport: string;
  species: string;
  expiry_date: string;
  issued_date: string;
  landOwner: string;
  contactNumber: string;
  lng: number;
  lat: number;
  status: string;
  qrcode: string;
  created_at: Date;
  updated_at: Date;
  noTruckloads: number;
  verificationFee: number;
  oathFee: number;
  inspectionFee: number;
  totalAmountDue: number;
  requestLetter: string;
  certificateBarangay: string;
  orCr: string;
  driverLicense: string;
  otherDocuments: string;
  steps: number;
  status_step: string;
  has_active_violation?: boolean;

  creator: {
    id: string;
    name: string;
    email: string;
  };
};
