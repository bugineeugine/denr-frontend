"use client";

import dynamic from "next/dynamic";
import { PermitDataType } from "@/types/permit";
import "leaflet/dist/leaflet.css";

const PermitMap = dynamic(() => import("./PermitMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl bg-white animate-pulse"
      style={{ height: 420, border: "1.5px solid #e5e7eb" }}
    />
  ),
});

export default function PermitMapLazy({ permits }: { permits: PermitDataType[] }) {
  return <PermitMap permits={permits} />;
}
