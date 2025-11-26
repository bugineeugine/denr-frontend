import { createUserSchema, updateUserSchema, userSchema } from "@/schema/userSchema";
import * as z from "zod";
import { DataResponseType } from ".";
export interface UserListsType {
  message: string;
  data: UserDataType[];
}

export interface UserDataType {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  position: string | null;
}

export type RequestCreateUserType = z.infer<typeof createUserSchema>;
export type UserSchemaType = z.infer<typeof userSchema>;
export type ResponseCreateUserType = DataResponseType<"data">;
export type RequestUpdateUserType = z.infer<typeof updateUserSchema>;
