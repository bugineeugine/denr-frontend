"use client";

import { useState } from "react";

// Material UI Icons
import Description from "@mui/icons-material/Description";
import Inventory2 from "@mui/icons-material/Inventory2";
import LocalShipping from "@mui/icons-material/LocalShipping";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Person from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOn from "@mui/icons-material/LocationOn";
import Park from "@mui/icons-material/Park";
import AttachMoney from "@mui/icons-material/AttachMoney";

import { PermitDataType } from "@/types/permit";
import Avatar from "@mui/material/Avatar";

export default function ViewPermitById({ permit }: [pertmi: PermitDataType]) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100">
      {Icon && <Icon className="w-5 h-5 !text-gray-400 mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-900 mt-1">{value || "N/A"}</p>
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Permit Details</h1>
              <p className="text-blue-100">Permit No: {permit.permit_no}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(permit.status)}`}>
                {permit.status}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 text-center">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <Avatar
              alt="QR"
              sx={{ height: 120, width: 120 }}
              variant="square"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${permit.qrcode}`}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">QR Code: {permit.qrcode}</p>
        </div>

        {/* Basic Information */}
        <Section title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Permit Type" value={permit.permit_type} icon={Description} />
            <InfoRow label="Permit Number" value={permit.permit_no} icon={Description} />
            <InfoRow label="Issued Date" value={permit.issued_date} icon={CalendarToday} />
            <InfoRow label="Expiry Date" value={permit.expiry_date} icon={CalendarToday} />
          </div>
        </Section>

        {/* Land Owner Information */}
        <Section title="Land Owner Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Land Owner" value={permit.land_owner} icon={Person} />
            <InfoRow label="Contact Number" value={permit.contact_no} icon={PhoneIcon} />
            <InfoRow label="Location" value={permit.location} icon={LocationOn} />
            <InfoRow label="Area" value={permit.area} icon={LocationOn} />
          </div>
        </Section>

        {/* Resource Details */}
        <Section title="Resource Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Species" value={permit.species} icon={Park} />
            <InfoRow label="Total Volume" value={permit.total_volume} icon={Inventory2} />
            <InfoRow label="Number of Truckloads" value={permit.noTruckloads} icon={LocalShipping} />
          </div>
        </Section>

        {/* Transportation Details */}
        <Section title="Transportation Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Plate Number" value={permit.plate_no} icon={LocalShipping} />
            <InfoRow label="Destination" value={permit.destination} icon={LocationOn} />
          </div>
        </Section>

        {/* Location Coordinates */}
        <Section title="Location Coordinates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Longitude" value={permit.lng} icon={LocationOn} />
            <InfoRow label="Latitude" value={permit.lat} icon={LocationOn} />
          </div>
        </Section>

        {/* Financial Information */}
        <Section title="Financial Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Verification Fee" value={permit.verificationFee} icon={AttachMoney} />
            <InfoRow label="Oath Fee" value={permit.oathFee} icon={AttachMoney} />
            <InfoRow label="Inspection Fee" value={permit.inspectionFee} icon={AttachMoney} />
            <InfoRow label="Total Amount Due" value={permit.totalAmountDue} icon={AttachMoney} />
            <InfoRow label="Grand Total" value={permit.grand_total} icon={AttachMoney} />
            <InfoRow label="Remaining Balance" value={permit.remaning_balance} icon={AttachMoney} />
          </div>
        </Section>

        <Section title="Required Documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow label="Request Letter" value={permit.requestLetter} icon={Description} />
            <InfoRow label="Barangay Certificate" value={permit.certificateBarangay} icon={Description} />
            <InfoRow label="OR/CR" value={permit.orCr} icon={Description} />
            <InfoRow label="Driver's License" value={permit.driverLicense} icon={Description} />
            <InfoRow label="Other Documents" value={permit.otherDocuments} icon={Description} />
          </div>
        </Section>
      </div>
    </div>
  );
}
