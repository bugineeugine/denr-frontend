"use client";

import { FC, ReactNode, SyntheticEvent, useState } from "react";

import Description from "@mui/icons-material/Description";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOn from "@mui/icons-material/LocationOn";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Person from "@mui/icons-material/Person";
import Forest from "@mui/icons-material/Forest";

import { PermitDataType } from "@/types/permit";
import Avatar from "@mui/material/Avatar";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import Box from "@mui/material/Box";
import { Tab, Tabs } from "@mui/material";

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

interface InfoRowProps {
  label: string;
  value?: string | number | ReactNode;
  icon?: FC<{ className?: string }>;
}

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const InfoRow: FC<InfoRowProps> = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-3 py-2.5 border-b border-gray-100 last:border-0">
    {Icon && <Icon className="w-4 h-4 text-gray-400! mt-0.5 shrink-0" />}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5 wrap-break-word">{value ?? "—"}</p>
    </div>
  </div>
);

const Section: FC<SectionProps> = ({ title, children, icon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      {icon && <span className="text-blue-500">{icon}</span>}
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h2>
    </div>
    {children}
  </div>
);

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  rejected: "bg-yellow-100 text-yellow-700",
};

const documents = (permit: PermitDataType) => [
  { label: "Request Letter", path: permit.requestLetter },
  { label: "Barangay Certificate", path: permit.certificateBarangay },
  { label: "OR/CR", path: permit.orCr },
  { label: "Driver's License", path: permit.driverLicense },
  { label: "Other Documents", path: permit.otherDocuments },
];

export default function ViewPermitById({ permit }: { permit: PermitDataType }) {
  const [docTab, setDocTab] = useState(0);
  const statusStyle = STATUS_STYLES[permit.status?.toLowerCase()] ?? "bg-gray-100 text-gray-700";
  const docs = documents(permit);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 mb-5 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              alt="QR"
              sx={{ height: 72, width: 72, borderRadius: 1, bgcolor: "white" }}
              variant="square"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${permit.qrcode}`}
            />
            <div>
              <h1 className="text-xl font-bold">Permit Details</h1>
              <p className="text-blue-200 text-sm mt-0.5">No. {permit.permit_no}</p>
              <p className="text-blue-200 text-xs mt-0.5">{permit.permit_type}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyle}`}>
            {permit.status}
          </span>
        </div>

        {/* Permit Info */}
        <Section title="Permit Information" icon={<Description fontSize="small" />}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6">
            <InfoRow label="Issued Date" value={permit.issued_date} icon={CalendarToday} />
            <InfoRow label="Expiry Date" value={permit.expiry_date} icon={CalendarToday} />
          </div>
        </Section>

        {/* Forest Product & Transport */}
        <Section title="Forest Product & Transport" icon={<Forest fontSize="small" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Type of Forest Product" value={permit.typeForestProduct} />
            <InfoRow label="Species" value={permit.species} />
            <InfoRow label="Estimated Volume / Quantity" value={permit.estimatedVolumeQuantity} />
            <InfoRow label="Conveyance & Plate Number" value={permit.typeConveyancePlateNumber} icon={LocalShipping} />
            <InfoRow label="Consignee / Destination" value={permit.consignee} />
            <InfoRow label="Date of Transport" value={permit.dateOfTransport} icon={CalendarToday} />
          </div>
        </Section>

        {/* Contact */}
        <Section title="Land Owner & Contact" icon={<Person fontSize="small" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Land Owner" value={permit.landOwner} />
            <InfoRow label="Contact Number" value={permit.contactNumber} />
          </div>
        </Section>

        {/* Location */}
        <Section title="Location" icon={<LocationOn fontSize="small" />}>
          <div className="grid grid-cols-2 gap-x-8 mb-4">
            <InfoRow label="Latitude" value={permit.lat} />
            <InfoRow label="Longitude" value={permit.lng} />
          </div>
          <MapContainer
            center={[permit.lat, permit.lng]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "40vh", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[permit.lat, permit.lng]}>
              <Popup>{permit.permit_no}</Popup>
            </Marker>
          </MapContainer>
        </Section>

        {/* Documents */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Supporting Documents</h2>
          </div>
          <Tabs
            value={docTab}
            onChange={(_: SyntheticEvent, v: number) => setDocTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, borderBottom: 1, borderColor: "divider" }}
          >
            {docs.map((d, i) => (
              <Tab key={i} label={d.label} sx={{ fontSize: "0.75rem" }} />
            ))}
          </Tabs>
          <Box
            component="iframe"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${docs[docTab].path}#toolbar=0&navpanes=0&scrollbar=0`}
            style={{ width: "100%", border: "none", height: "70vh", display: "block" }}
          />
        </div>

      </div>
    </div>
  );
}
