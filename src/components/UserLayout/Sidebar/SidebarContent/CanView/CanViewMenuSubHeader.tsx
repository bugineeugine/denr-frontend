import useAuth from "@/store/useAuth";
import { ReactNode } from "react";

const CanViewMenuSubHeader = ({ action, children }: { action?: string[]; children: ReactNode }) => {
  const userData = useAuth((state) => state.userData);
  const permissions = userData?.permissions ?? [];

  const hasAccess = action?.some((element) => permissions.includes(element));
  if (!action) {
    return children;
  }
  if (hasAccess) {
    return children;
  }

  return null;
};

export default CanViewMenuSubHeader;
