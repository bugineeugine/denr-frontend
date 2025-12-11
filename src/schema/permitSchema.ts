import * as z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
export const permitSchema = z.object({
  land_owner: z.string().nonempty({ error: "Landowner is required" }),
  contact_no: z.string().nonempty({ error: "Contact No. is required" }),
  location: z.string().nonempty({ error: "Location is required" }),
  area: z.string().nonempty({ error: "Area  is required" }),
  species: z.string().nonempty({ error: "Species is required" }),
  total_volume: z.string().nonempty({ error: "Total Volume is required" }),
  plate_no: z.string().nonempty({ error: "Vehicle / Plate No. is required" }),
  destination: z.string().nonempty({ error: "Destination is required" }),
  expiry_date: z.string().nonempty({ error: "Expiry Date is required" }),
  grand_total: z.string().optional().default("0"),
  remaning_balance: z.string().optional().default("0"),
  issued_date: z.string().nonempty({ error: "Issued Date is required" }),
  lng: z.number(),
  lat: z.number(),

  requestLetter: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file (JPEG, PNG, or GIF ,PDF).",
    }),
  certificateBarangay: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    }),
  orCr: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    }),
  driverLicense: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    }),
  otherDocuments: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    })
    .nullable()
    .default(null),
});

export const createPermitSchema = permitSchema.omit({ issued_date: true, expiry_date: true });

export const updatePermitSchema = permitSchema
  .omit({ requestLetter: true, certificateBarangay: true, orCr: true, driverLicense: true, otherDocuments: true })
  .extend({ status: z.string() });
