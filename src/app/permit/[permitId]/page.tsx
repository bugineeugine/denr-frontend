import ViewPermitById from "@/components/permit/ViewPermitById";
import { PermitDataType } from "@/types/permit";
import axiosInstance from "@/utils/axiosInstance";
import decodedToken from "@/utils/decodedToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ALLOWED_ROLES = ["validator", "admin"];

const ViewPermitByIdPage = async ({ params }: { params: Promise<{ permitId: string }> }) => {
  const { permitId } = await params;

  const cookieStore = await cookies();

  /* ── Role check ────────────────────────────────────────────── */
  const token = cookieStore.get("accessToken")?.value ?? cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login?reason=unauthorized");
  }

  try {
    const decoded = decodedToken(token);

    const role = (decoded as { role?: string }).role?.toLowerCase() ?? "";

    if (!ALLOWED_ROLES.includes(role)) {
      redirect("/login?reason=unauthorized");
    }
  } catch {
    redirect("/login?reason=unauthorized");
  }

  /* ── Fetch permit ──────────────────────────────────────────── */
  const response = await axiosInstance.get(`/permits/find/${permitId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const permit = response.data.data as PermitDataType;

  return <ViewPermitById permit={permit} />;
};

export default ViewPermitByIdPage;
