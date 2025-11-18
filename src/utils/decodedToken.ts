import { UserDataType } from "@/types/user";
import { jwtDecode } from "jwt-decode";

const decodedToken = (token: string) => {
  return jwtDecode<UserDataType>(token);
};

export default decodedToken;
