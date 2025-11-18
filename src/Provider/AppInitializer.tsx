"use client";
import FallbackSpinner from "@/components/FallbackSpinner";
import useAuth from "@/store/useAuth";
import { AuthData } from "@/types/auth";

import { ReactNode, useEffect } from "react";

type Props = {
  user: { userData: AuthData };
  children: ReactNode;
};

const AppInitializer = (props: Props) => {
  const { user, children } = props;
  useEffect(() => {
    useAuth.getState().setUserData(user.userData);
  }, [user]);

  if (!user) {
    return <FallbackSpinner />;
  }
  return children;
};

export default AppInitializer;
