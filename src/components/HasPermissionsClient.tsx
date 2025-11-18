"use client";

import useAuth from "@/store/useAuth";
import { ReactNode } from "react";

type HasPermissionsProps = {
  children: ReactNode;
  action: string | string[];
  component?: ReactNode;
};

const HasPermissionsClient = ({ children, action, component }: HasPermissionsProps) => {
  const actionSplit = action;

  const userData = useAuth((state) => state.userData);

  const permissions = userData?.permissions || [];

  const hasPermissions = Array.isArray(actionSplit)
    ? permissions.some((element) => actionSplit.includes(element))
    : permissions?.includes(actionSplit);

  if (!hasPermissions && !component) {
    return null;
  }

  if (!hasPermissions && component) {
    return component;
  }

  return <>{children}</>;
};

export default HasPermissionsClient;
