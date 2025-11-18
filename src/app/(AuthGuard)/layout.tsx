import FallbackSpinner from "@/components/FallbackSpinner";
import UserLayout from "@/components/UserLayout";

import AppInitializer from "@/Provider/AppInitializer";
import axiosInstance from "@/utils/axiosInstance";

import { cookies } from "next/headers";
import { ReactNode, Suspense } from "react";

const GuardLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();

  const response = await axiosInstance.get("/auth/user-data", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const user = response.data.user;

  return (
    <AppInitializer
      user={{
        userData: user,
      }}
    >
      <UserLayout>{children}</UserLayout>
    </AppInitializer>
  );
};
const AuthGuardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <GuardLayout>{children}</GuardLayout>
    </Suspense>
  );
};

export default AuthGuardLayout;
