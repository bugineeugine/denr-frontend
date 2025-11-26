import * as z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
export const citizenCharter = z.object({
  type_transaction: z.string().nonempty({ error: "Client Type is required" }),

  requestLetter: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file (JPEG, PNG, or GIF ,PDF).",
    }),
  barangayCertification: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    }),
  treeCuttingPermit: z
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
  transportAgreement: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    }),
  spa: z
    .instanceof(File, { message: "Please select an  file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid  file (JPEG, PNG, or GIF ,PDF).",
    }),
});

export const createCitizenCharterSchema = citizenCharter;
