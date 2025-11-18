import ViewPermitById from "@/components/permit/ViewPermitById";
import axiosInstance from "@/utils/axiosInstance";
import decodedToken from "@/utils/decodedToken";
import { cookies } from "next/headers";

import React from "react";

const ViewPermitByIdPage = async ({ params }: { params: Promise<{ permitId: string }> }) => {
  const { permitId } = await params;

  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value || "";

  const decoded = decodedToken(token);

  try {
    const response = await axiosInstance.get(`/permits/find/${permitId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return <ViewPermitById permit={response.data.data} />;
  } catch (error) {
    console.log({ error });
    return <div>ERror</div>;
  }
};

export default ViewPermitByIdPage;
