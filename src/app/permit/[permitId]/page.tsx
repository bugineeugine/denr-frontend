import ViewPermitById from "@/components/permit/ViewPermitById";
import { PermitDataType } from "@/types/permit";
import axiosInstance from "@/utils/axiosInstance";
import { cookies } from "next/headers";

const ViewPermitByIdPage = async ({ params }: { params: Promise<{ permitId: string }> }) => {
  const { permitId } = await params;

  const cookieStore = await cookies();

  const response = await axiosInstance.get(`/permits/find/${permitId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const permit = response.data.data as PermitDataType;
  return <ViewPermitById permit={permit} />;
};

export default ViewPermitByIdPage;
