import { AuthData } from "@/types/auth";
import { create } from "zustand";

type AuthType = {
  userData: AuthData | null;
  exp: number;
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
  permissions: () => AuthData["permissions"] | string[];
  setUserData: (data: AuthData | null) => void;
  setExp: (value: number) => void;
  logout: () => void;
};

const useAuth = create<AuthType>()((set, get) => ({
  userData: null,
  loading: false,
  exp: 0,
  isLogin: false,
  setIsLogin: (val) => {
    set({ isLogin: val });
  },
  permissions: () => {
    return get().userData?.permissions ?? [];
  },
  setUserData: (data) => {
    set({ userData: data });
  },

  setExp: (value) => {
    set({ exp: value });
  },
  logout: () => {
    set({ userData: null, exp: 0, isLogin: false });
  },
}));

export default useAuth;
