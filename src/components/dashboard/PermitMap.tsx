"use client";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { PermitDataType } from "@/types/permit";
import { Typography } from "@mui/material";

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const PermitMap = ({ permits }: { permits: PermitDataType[] }) => {
  return (
    <MapContainer center={[16.0, 121.0]} zoom={7} scrollWheelZoom={true} style={{ height: "50vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {permits.map((permit) => (
        <Marker key={permit.id} position={[permit.lat, permit.lng]}>
          <Tooltip permanent direction="top">
            {permit.permit_no}
          </Tooltip>
          <Popup>
            <Typography variant="body2">
              <strong>Permit No:</strong> {permit.permit_no}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {permit.status}
            </Typography>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PermitMap;
