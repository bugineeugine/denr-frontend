"use client";

import { Marker, Popup, Tooltip } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { PermitDataType } from "@/types/permit";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const STATUS_DOT: Record<string, string> = {
  Pending:  "#38bdf8",
  Approved: "#22c55e",
  Expired:  "#f87171",
  Rejected: "#d97706",
};

export default function PermitMap({ permits }: { permits: PermitDataType[] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
          >
            <MapOutlinedIcon sx={{ fontSize: 14, color: "#166534" }} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 block">
              Permit Locations
            </span>
            <span className="text-[10px] text-slate-400">Geo-tagged transport permits</span>
          </div>
        </div>

        {/* Status legend */}
        <div className="hidden sm:flex items-center gap-4">
          {Object.entries(STATUS_DOT).map(([status, dot]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
              <span className="text-[10px] font-semibold text-slate-500">{status}</span>
            </div>
          ))}
          <span className="text-[11px] font-semibold text-slate-400 ml-2">
            {permits.length} permit{permits.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Map */}
      <div style={{ height: "50vh" }}>
        <MapContainer
          center={[16.0, 121.0]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {permits.map((permit) => (
            <Marker key={permit.id} position={[permit.lat, permit.lng]}>
              <Tooltip permanent direction="top">
                <span style={{ fontSize: 10, fontWeight: 700, color: "#14532d" }}>
                  {permit.permit_no}
                </span>
              </Tooltip>
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <p style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", marginBottom: 4 }}>
                    {permit.permit_no}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: STATUS_DOT[permit.status] ?? "#9ca3af",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#475569" }}>{permit.status}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{permit.permit_type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
