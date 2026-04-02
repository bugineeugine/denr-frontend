"use client";
import { useDisclosure } from "@/hooks/useDisclosure";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { PermitDataType } from "@/types/permit";
import Button from "@mui/material/Button";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import History from "../Timeline/History";
import Comments from "./Comments";
import Avatar from "@mui/material/Avatar";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { SyntheticEvent, useEffect, useState } from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import useAuth from "@/store/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

/* ── helpers ─────────────────────────────────────────────────────────── */

const STATUS_META: Record<string, { color: string; bg: string; dot: string }> = {
  Pending: { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8" },
  Expired: { color: "#b91c1c", bg: "#fee2e2", dot: "#f87171" },
  Rejected: { color: "#92400e", bg: "#fef3c7", dot: "#fbbf24" },
  Approved: { color: "#166534", bg: "#dcfce7", dot: "#4ade80" },
};

const getStatus = (s: string) => STATUS_META[s] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };

/* ── sub-components ──────────────────────────────────────────────────── */

const SectionLabel = ({ icon, children }: { icon: React.ReactNode; children: string }) => (
  <div className="flex items-center gap-2 pb-2 mb-3" style={{ borderBottom: "1.5px solid #e5e7eb" }}>
    <span className="flex items-center text-[#166534]">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{children}</span>
  </div>
);

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-[3px]">
    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
    <span className="text-[13px] font-semibold text-slate-800 leading-snug">
      {value ?? <span className="font-normal italic text-slate-400">Not specified</span>}
    </span>
  </div>
);

const DisplayFileContent = ({ permit }: { permit: PermitDataType }) => {
  const documents = [
    { title: "Request Letter", path: permit.requestLetter },
    { title: "Barangay Certificate", path: permit.certificateBarangay },
    { title: "OR / CR", path: permit.orCr },
    { title: "Driver License", path: permit.driverLicense },
    ...(permit.otherDocuments ? [{ title: "Other Documents", path: permit.otherDocuments }] : []),
  ];
  return (
    <div className="flex flex-col gap-4">
      {documents.map((doc) => (
        <Card
          key={doc.title}
          variant="outlined"
          sx={{
            borderRadius: "14px",
            overflow: "hidden",
            borderColor: "#e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <CardHeader
            title={doc.title}
            titleTypographyProps={{ variant: "subtitle2", fontWeight: 700, fontSize: "0.8rem" }}
            sx={{
              py: 1.5,
              px: 2,
              borderBottom: "1px solid #e5e7eb",
              bgcolor: "#f8fafc",
            }}
          />
          <CardMedia
            component="iframe"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${doc.path}#toolbar=0&navpanes=0&scrollbar=0`}
            style={{ width: "100%", height: "90vh", border: "none" }}
          />
        </Card>
      ))}
    </div>
  );
};

/* ── main component ──────────────────────────────────────────────────── */

const BASE_TABS = [
  { value: "details", label: "Details", icon: <InfoOutlinedIcon sx={{ fontSize: 15 }} /> },
  { value: "files", label: "Files", icon: <FolderOutlinedIcon sx={{ fontSize: 15 }} /> },
];

const PermitDrawer = ({ permit }: { permit: PermitDataType }) => {
  const disclosure = useDisclosure();
  const [tab, setTab] = useState("details");
  const queryClient = useQueryClient();
  const userData = useAuth((state) => state.userData);
  const statusMeta = getStatus(permit.status);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    axiosInstance
      .get(`/comments/${permit.id}`)
      .then((r) => setCommentCount((r.data?.data ?? []).length))
      .catch(() => {});
  }, [permit.id]);

  const nameParts = permit.creator.name.split(" ");
  const initials = nameParts
    .map((p) => p[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const handleTabChange = (_: SyntheticEvent, v: string) => setTab(v);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put(`/permits/approve/${permit.permit_no}`);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["permits"] });
      customToast(res.message);
    },
    onError: () => customToast("Something went wrong", "error"),
  });

  const handleApprove = async () => {
    await mutateAsync();
    disclosure.onClose();
  };

  return (
    <>
      <IconButton onClick={disclosure.onOpen} size="small" color="inherit">
        <RemoveRedEyeOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Drawer
        open={disclosure.isOpen}
        anchor="right"
        className="z-[calc(var(--mui-zIndex-drawer)+1)]"
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 540, md: 860, lg: 1180 },
              display: "flex",
              flexDirection: "column",
              bgcolor: "#f8fafc",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* ══ HEADER ═══════════════════════════════════════════════════ */}
        <div
          className="flex shrink-0 items-center justify-between px-5 py-3"
          style={{
            background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
            boxShadow: "0 2px 12px rgba(20,83,45,0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={disclosure.onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              <KeyboardDoubleArrowRightOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80 leading-none mb-0.5">
                Permit Application
              </p>
              <p className="text-sm font-bold text-white leading-none tracking-wide">#{permit.permit_no}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
              style={{ background: statusMeta.bg, color: statusMeta.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusMeta.dot }} />
              {permit.status}
            </span>
            <span className="text-[11px] font-medium text-emerald-100/60 ml-1">{permit.permit_type}</span>
          </div>
        </div>

        {/* ══ BODY ═════════════════════════════════════════════════════ */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ── Left panel (scrollable) ─────────────────────────────── */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ borderRight: "1.5px solid #e5e7eb" }}>
            {/* Tab bar */}
            <div
              className="flex shrink-0 items-center gap-1 px-4 py-2"
              style={{ background: "#fff", borderBottom: "1.5px solid #e5e7eb" }}
            >
              {[
                ...BASE_TABS,
                {
                  value: "notes",
                  label: "Notes",
                  icon: <FolderOutlinedIcon sx={{ fontSize: 15 }} />,
                  badge: commentCount,
                },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={(e) => handleTabChange(e as unknown as SyntheticEvent, t.value)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                  style={
                    tab === t.value
                      ? { background: "linear-gradient(135deg, #14532d, #166534)", color: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.3)" }
                      : { color: "#64748b", background: "transparent" }
                  }
                >
                  {t.icon}
                  {t.label}
                  {"badge" in t && t.badge > 0 && (
                    <span
                      className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                      style={
                        tab === t.value
                          ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                          : { background: "#fef3c7", color: "#92400e" }
                      }
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-4">
              {tab === "details" && (
                <div className="flex flex-col gap-5">
                  {/* Applicant card */}
                  <div
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{
                      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                      border: "1.5px solid #bbf7d0",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        fontWeight: 800,
                        fontSize: "1rem",
                        background: "linear-gradient(135deg, #14532d, #166534)",
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(20,83,45,0.3)",
                      }}
                    >
                      {initials}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-800 truncate">{permit.creator.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{permit.creator.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700/60">
                        Submitted
                      </p>
                      <p className="text-[12px] font-bold text-emerald-800">{permit.issued_date ?? "—"}</p>
                    </div>
                  </div>

                  {/* Forest product info */}
                  <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
                    <SectionLabel icon={<ForestOutlinedIcon sx={{ fontSize: 14 }} />}>Forest Product</SectionLabel>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <DetailItem label="Type of Forest Product" value={permit.typeForestProduct} />
                      <DetailItem label="Species" value={permit.species} />
                      <DetailItem label="Estimated Volume / Quantity" value={permit.estimatedVolumeQuantity} />
                      <DetailItem label="Land Owner" value={permit.landOwner} />
                    </div>
                  </div>

                  {/* Transport info */}
                  <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
                    <SectionLabel icon={<LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />}>
                      Transport Details
                    </SectionLabel>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <DetailItem label="Conveyance & Plate No." value={permit.typeConveyancePlateNumber} />
                      <DetailItem label="Consignee / Destination" value={permit.consignee} />
                      <DetailItem label="Date of Transport" value={permit.dateOfTransport} />
                      <DetailItem label="Contact Number" value={permit.contactNumber} />
                    </div>
                  </div>

                  {/* Validity */}
                  <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}>
                    <SectionLabel icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />}>
                      Validity Period
                    </SectionLabel>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <DetailItem label="Issued Date" value={permit.issued_date} />
                      <DetailItem label="Expiry Date" value={permit.expiry_date} />
                    </div>
                  </div>

                  {/* QR + map row */}
                  <div className="grid grid-cols-[auto_1fr] gap-4">
                    {/* QR */}
                    <div
                      className="flex flex-col items-center gap-3 rounded-2xl p-4"
                      style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}
                    >
                      <SectionLabel icon={<QrCode2OutlinedIcon sx={{ fontSize: 14 }} />}>QR Code</SectionLabel>
                      <div
                        className="rounded-xl overflow-hidden"
                        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)", padding: 6, background: "#fff" }}
                      >
                        <Avatar
                          alt="QR"
                          sx={{ height: 140, width: 140, borderRadius: "10px" }}
                          variant="square"
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${permit.qrcode}`}
                          style={{ display: "block", borderRadius: 8 }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tracking-wider">{permit.permit_no}</span>
                    </div>

                    {/* Map */}
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{ border: "1.5px solid #e5e7eb", minHeight: 200 }}
                    >
                      <div
                        className="flex items-center gap-2 px-3 py-2"
                        style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}
                      >
                        <LocationOnOutlinedIcon sx={{ fontSize: 14, color: "#166534" }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Location
                        </span>
                      </div>
                      <MapContainer
                        center={[permit.lat, permit.lng]}
                        zoom={6}
                        scrollWheelZoom
                        style={{ height: "220px", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[permit.lat, permit.lng]}>
                          <Popup>{permit.permit_type}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </div>
              )}

              {tab === "files" && <DisplayFileContent permit={permit} />}
              {tab === "notes" && <Comments permitId={permit.id} />}
            </div>
          </div>

          {/* ── Right panel: timeline ───────────────────────────────── */}
          <div
            className="flex w-[300px] shrink-0 flex-col overflow-hidden lg:w-[340px]"
            style={{ background: "#111827" }}
          >
            {/* Timeline header */}
            <div
              className="flex shrink-0 items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <HistoryOutlinedIcon sx={{ fontSize: 15, color: "#4ade80" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
                Processing History
              </span>
            </div>

            {/* Timeline scroll area */}
            <div className="min-h-0 flex-1 overflow-auto">
              <History permit={permit} />
            </div>
          </div>
        </div>

        {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
        {userData?.role === "officer" && (
          <div
            className="flex shrink-0 items-center justify-between px-5 py-3"
            style={{ background: "#fff", borderTop: "1.5px solid #e5e7eb" }}
          >
            <p className="text-[11px] text-slate-400">Approving will advance this permit to the next step.</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                size="small"
                onClick={disclosure.onClose}
                disabled={isPending}
                sx={{
                  borderColor: "#e5e7eb",
                  color: "#64748b",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleApprove}
                loading={isPending}
                variant="contained"
                size="small"
                startIcon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  background: "linear-gradient(135deg, #14532d, #166534)",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(20,83,45,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #166534, #15803d)",
                    boxShadow: "0 6px 16px rgba(20,83,45,0.45)",
                  },
                }}
              >
                Approve Application
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default PermitDrawer;
