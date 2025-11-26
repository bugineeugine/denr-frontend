import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, { error: "Password must contain at least 8 characters" })
  .max(55, { error: "Password must 55 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/])[A-Za-z\d@$!%*?&#/]+$/, {
    error:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  });

export const userSchema = z.object({
  name: z.string().nonempty({ error: "Name is required" }),
  email: z.email({ error: "Invalid format email" }).nonempty({ error: "Email is required" }),
  role: z.string().nonempty({ error: "Role is required" }),
  position: z.string().nullable().optional(),
  password: passwordSchema,
});

const pass = z
  .string()
  .optional()
  .superRefine((val, ctx) => {
    if (val !== undefined && val !== "") {
      if (val.length < 8) {
        ctx.addIssue({
          code: "custom",
          minimum: 8,
          type: "string",
          inclusive: true,
          message: "Password must contain at least 8 characters",
        });
      }
      if (val.length > 55) {
        ctx.addIssue({
          code: "custom",
          maximum: 55,
          type: "string",
          inclusive: true,
          message: "Password must be under 55 characters",
        });
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/])/.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "Password must contain at least one uppercase, lowercase, number, and special character",
        });
      }
    }
  });
export const createUserSchema = userSchema.superRefine((data, ctx) => {
  if (data.role === "officer") {
    if (!data.position || data.position.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Position is required when role is officer",
        path: ["position"],
      });
    }
  }
});
export const updateSettingsSchema = userSchema.omit({ password: true, role: true }).extend({
  password: pass,
});
export const updateUserSchema = userSchema
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .optional()
      .superRefine((val, ctx) => {
        if (val !== undefined && val !== "") {
          if (val.length < 8) {
            ctx.addIssue({
              code: "custom",
              minimum: 8,
              type: "string",
              inclusive: true,
              message: "Password must contain at least 8 characters",
            });
          }
          if (val.length > 55) {
            ctx.addIssue({
              code: "custom",
              maximum: 55,
              type: "string",
              inclusive: true,
              message: "Password must be under 55 characters",
            });
          }
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/])/.test(val)) {
            ctx.addIssue({
              code: "custom",
              message: "Password must contain at least one uppercase, lowercase, number, and special character",
            });
          }
        }
      }),
  })
  .superRefine((data, ctx) => {
    if (data.role === "officer") {
      if (!data.position || data.position.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Position is required when role is officer",
          path: ["position"],
        });
      }
    }
  });
