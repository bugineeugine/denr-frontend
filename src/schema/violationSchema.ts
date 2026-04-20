import * as z from "zod";

export const violationSchema = z.object({
  permit_id: z.string().optional().nullable(),
  violator_name: z.string().min(1, "Violator name is required"),
  contact_number: z.string().optional(),
  location: z.string().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  violation_type: z.string().min(1, "Violation type is required"),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  description: z.string().min(3, "Description is required"),
  date_recorded: z.string().min(1, "Date recorded is required"),
  status: z.enum(["Open", "Investigating", "Resolved", "Dismissed"]).optional(),
});

export type ViolationSchemaType = z.infer<typeof violationSchema>;
