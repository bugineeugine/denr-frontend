import AnnualyPermit from "@/components/dashboard/AnnualyPermit";
import PermitMap from "@/components/dashboard/PermitMap";
import PermitStatus from "@/components/dashboard/PermitStatus";
import StatCards from "@/components/dashboard/StatCards";
import RecentApplications from "@/components/dashboard/RecentApplications";
import { DashboardDatatype } from "@/types/dashboard";
import axiosInstance from "@/utils/axiosInstance";
import { cookies } from "next/headers";
import "leaflet/dist/leaflet.css";

const DashboardPage = async () => {
  const cookieStore = await cookies();

  const response = await axiosInstance.get("/dashboard", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const permits = response.data.data as DashboardDatatype;

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      {/* ── Page header ──────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-6 py-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
        />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300/70 mb-1">DENR CENRO</p>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}
          >
            Dashboard & Analytics
          </h1>
          <p className="text-emerald-200/60 text-sm mt-0.5" style={{ fontWeight: 300 }}>
            Real-time overview of permit applications and compliance metrics
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-5">
        {/* ── Stat cards ───────────────────────────────────────────── */}
        <StatCards permits={permits} />

        {/* ── Annual chart ─────────────────────────────────────────── */}
        <AnnualyPermit permitByYear={permits.permitsByYear} />

        {/* ── Recent + Status ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <RecentApplications permits={permits.latestPermits} />
          </div>
          <div className="md:col-span-5">
            <PermitStatus permitsByStatus={permits.permitsByStatus} />
          </div>
        </div>

        {/* ── Map ──────────────────────────────────────────────────── */}
        <PermitMap permits={permits.allPermit} />
      </div>
    </div>
  );
};

export default DashboardPage;
