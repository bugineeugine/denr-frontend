import useAuth from "@/store/useAuth";
import { ReactNode } from "react";

const CanViewMenuItem = ({ action, children }: { action?: string | string[]; children: ReactNode }) => {
  const userData = useAuth((state) => state.userData);

  const permissions = userData?.permissions ?? [];

  if (!action) {
    return <>{children}</>;
  }
  const hasPermissions = Array.isArray(action)
    ? permissions.some((element) => action.includes(element))
    : permissions?.includes(action);
  if (hasPermissions) {
    return <>{children}</>;
  }

  return null;
};

export default CanViewMenuItem;
