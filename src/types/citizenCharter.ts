import { createCitizenCharterSchema } from "@/schema/citizenCharterSchema";
import * as z from "zod";

export type RequestCreateCitizenCharter = z.infer<typeof createCitizenCharterSchema>;
export type ResponseCitizenCharterType = {
  message: string;
  data: CitizenCharterType[];
};

export interface CitizenCharterType {
  id: string;
  citizen_no: string;
  type_transaction: string;
  requestLetter: string;
  barangayCertification: string;
  treeCuttingPermit: string;
  orCr: string;
  transportAgreement: string;
  spa: string;
  status: string;
  steps: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}
