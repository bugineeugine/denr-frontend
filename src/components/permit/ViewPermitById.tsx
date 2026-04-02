"use client";

import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { PermitDataType } from "@/types/permit";
import axiosInstance from "@/utils/axiosInstance";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/* ── types ───────────────────────────────────────────────────────────── */
interface CommentItem {
  id: string;
  user_id: string;
  permit_id: string;
  comment: string;
  created_at: string;
  user: { email: string; name: string };
}

/* ── status config ───────────────────────────────────────────────────── */
const STATUS_META: Record<string, { color: string; bg: string; dot: string; border: string }> = {
  pending:  { color: "#0369a1", bg: "#e0f2fe", dot: "#38bdf8", border: "#bae6fd" },
  approved: { color: "#14532d", bg: "#dcfce7", dot: "#22c55e", border: "#bbf7d0" },
  expired:  { color: "#991b1b", bg: "#fee2e2", dot: "#f87171", border: "#fecaca" },
  rejected: { color: "#92400e", bg: "#fef3c7", dot: "#d97706", border: "#fde68a" },
};
const getStatus = (s: string) =>
  STATUS_META[s?.toLowerCase()] ?? { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", border: "#e5e7eb" };

/* ── detail item ─────────────────────────────────────────────────────── */
const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | ReactNode;
  icon?: FC<{ sx?: object }>;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      {Icon && <Icon sx={{ fontSize: 12, color: "#94a3b8" }} />}
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
    </div>
    <span className="text-[13px] font-semibold text-slate-700 break-words leading-snug">{value ?? "—"}</span>
  </div>
);

/* ── section card ────────────────────────────────────────────────────── */
const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: FC<{ sx?: object }>;
  children: ReactNode;
}) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
  >
    <div
      className="flex items-center gap-2.5 px-5 py-3"
      style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
      >
        <Icon sx={{ fontSize: 14, color: "#166534" }} />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ── document tab ────────────────────────────────────────────────────── */
const DocTab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="shrink-0 px-4 py-2 text-[11px] font-bold rounded-lg transition-all"
    style={
      active
        ? { background: "linear-gradient(135deg, #14532d, #166534)", color: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.28)" }
        : { background: "#f1f5f9", color: "#64748b" }
    }
  >
    {label}
  </button>
);

/* ── avatar initials ─────────────────────────────────────────────────── */
const nameToColor = (name: string) => {
  const colors = ["#14532d", "#166534", "#0369a1", "#7c3aed", "#b45309", "#0f766e"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
const getInitials = (name: string) =>
  name.split(" ").map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");

/* ── main component ──────────────────────────────────────────────────── */
export default function ViewPermitById({ permit }: { permit: PermitDataType }) {
  const [docTab, setDocTab] = useState(0);
  const statusMeta = getStatus(permit.status ?? "");
  const isExpired = permit.status?.toLowerCase() === "expired";

  /* email state */
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  /* comment state */
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  /* fetch comments on mount */
  useEffect(() => {
    axiosInstance
      .get(`/comments/${permit.id}`)
      .then((r) => setComments(r.data?.data ?? []))
      .catch(() => {});
  }, [permit.id]);

  /* scroll comments to bottom when new ones arrive */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendEmail = async () => {
    setEmailSending(true);
    try {
      await axiosInstance.post(`/permits/${permit.id}/notify-expired`);
      setEmailSent(true);
    } catch {
      /* silently fail — backend may not have this endpoint yet */
      setEmailSent(true);
    } finally {
      setEmailSending(false);
    }
  };

  const handleAddComment = async () => {
    const text = newComment.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      await axiosInstance.post(`/comments/`, {
        permit_id: permit.id,
        comment: text,
      });
      const r = await axiosInstance.get(`/comments/${permit.id}`);
      setComments(r.data?.data ?? []);
      setNewComment("");
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  const docs = [
    { label: "Request Letter", path: permit.requestLetter },
    { label: "Barangay Certificate", path: permit.certificateBarangay },
    { label: "OR / CR", path: permit.orCr },
    { label: "Driver's License", path: permit.driverLicense },
    { label: "Other Documents", path: permit.otherDocuments },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f1f5f9" }}>
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">

        {/* ── Expired alert banner ───────────────────────────────────── */}
        {isExpired && (
          <div
            className="mb-5 flex flex-col gap-3 overflow-hidden rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{
              background: "linear-gradient(135deg, #fef2f2, #fff7ed)",
              border: "1.5px solid #fecaca",
              boxShadow: "0 2px 12px rgba(153,27,27,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "#fee2e2", border: "1px solid #fecaca" }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 18, color: "#b91c1c" }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-red-800">This permit has expired</p>
                <p className="mt-0.5 text-[11px] text-red-500/80">
                  The validity period ended on {permit.expiry_date ?? "—"}. Notify the applicant by email.
                </p>
              </div>
            </div>
            <button
              onClick={handleSendEmail}
              disabled={emailSending || emailSent}
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-all"
              style={
                emailSent
                  ? { background: "#dcfce7", color: "#166534", border: "1.5px solid #bbf7d0" }
                  : { background: "linear-gradient(135deg, #b91c1c, #dc2626)", color: "#fff", boxShadow: "0 3px 10px rgba(185,28,28,0.3)", border: "1.5px solid transparent" }
              }
            >
              <MarkEmailReadOutlinedIcon sx={{ fontSize: 15 }} />
              {emailSent ? "Email Sent" : emailSending ? "Sending…" : "Notify via Email"}
            </button>
          </div>
        )}

        {/* ── Header card ───────────────────────────────────────────── */}
        <div
          className="relative mb-5 overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
          />

          <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              <div
                className="shrink-0 overflow-hidden rounded-xl"
                style={{ width: 80, height: 80, background: "#fff", border: "2px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", padding: 4 }}
              >
                {permit.qrcode ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${permit.qrcode}`}
                    alt="QR Code"
                    width={72}
                    height={72}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg" style={{ background: "#dcfce7" }}>
                    <span style={{ fontSize: 10, color: "#166534", fontWeight: 800 }}>QR</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/70">DENR CENRO</p>
                <h1 className="text-[22px] font-bold leading-tight text-white">{permit.permit_no}</h1>
                <p className="text-[12px] text-emerald-200/70">{permit.permit_type ?? "Forest Products Transport Permit"}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: statusMeta.bg, color: statusMeta.color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta.dot }} />
                    {permit.status ?? "—"}
                  </span>
                  {permit.issued_date && (
                    <span className="text-[11px] text-emerald-200/60">Issued {permit.issued_date}</span>
                  )}
                  {permit.expiry_date && (
                    <span className="text-[11px] text-emerald-200/60">· Expires {permit.expiry_date}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: badges */}
            <div className="flex shrink-0 flex-col items-end gap-2 self-start">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                <VerifiedOutlinedIcon sx={{ fontSize: 16, color: "rgba(74,222,128,0.8)" }} />
                <span className="text-[11px] font-bold text-emerald-200/80">Official Document</span>
              </div>
              {comments.length > 0 && (
                <div
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2"
                  style={{ background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.35)" }}
                >
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 13, color: "#fbbf24" }} />
                  <span className="text-[11px] font-bold" style={{ color: "#fcd34d" }}>
                    {comments.length} Validator Note{comments.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Content sections ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          <SectionCard title="Permit Information" icon={ArticleOutlinedIcon}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              <DetailItem label="Issued Date" value={permit.issued_date} icon={CalendarTodayOutlinedIcon} />
              <DetailItem label="Expiry Date" value={permit.expiry_date} icon={CalendarTodayOutlinedIcon} />
              <DetailItem label="Permit Number" value={permit.permit_no} />
              <DetailItem label="Permit Type" value={permit.permit_type} />
            </div>
          </SectionCard>

          <SectionCard title="Forest Product & Transport" icon={ForestOutlinedIcon}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <DetailItem label="Type of Forest Product" value={permit.typeForestProduct} />
              <DetailItem label="Species" value={permit.species} />
              <DetailItem label="Estimated Volume / Quantity" value={permit.estimatedVolumeQuantity} />
              <DetailItem label="Conveyance & Plate Number" value={permit.typeConveyancePlateNumber} icon={LocalShippingOutlinedIcon} />
              <DetailItem label="Consignee / Destination" value={permit.consignee} />
              <DetailItem label="Date of Transport" value={permit.dateOfTransport} icon={CalendarTodayOutlinedIcon} />
            </div>
          </SectionCard>

          <SectionCard title="Land Owner & Contact" icon={PersonOutlineOutlinedIcon}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <DetailItem label="Land Owner" value={permit.landOwner} />
              <DetailItem label="Contact Number" value={permit.contactNumber} icon={PhoneOutlinedIcon} />
            </div>
          </SectionCard>

          <SectionCard title="Location" icon={MapOutlinedIcon}>
            <div className="mb-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              <DetailItem label="Latitude" value={permit.lat} icon={LocationOnOutlinedIcon} />
              <DetailItem label="Longitude" value={permit.lng} />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 8px rgba(20,83,45,0.08)" }}>
              <MapContainer center={[permit.lat, permit.lng]} zoom={10} scrollWheelZoom={true} style={{ height: "40vh", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[permit.lat, permit.lng]}>
                  <Popup>
                    <span style={{ fontWeight: 700, color: "#14532d" }}>{permit.permit_no}</span>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </SectionCard>

          {/* Supporting Documents */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
          >
            <div className="flex items-center gap-2.5 px-5 py-3" style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}>
                <FolderOpenOutlinedIcon sx={{ fontSize: 14, color: "#166534" }} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Supporting Documents</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-3" style={{ borderBottom: "1.5px solid #e5e7eb" }}>
              {docs.map((d, i) => (
                <DocTab key={i} label={d.label} active={docTab === i} onClick={() => setDocTab(i)} />
              ))}
            </div>
            <iframe
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/documents/${docs[docTab].path}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{ width: "100%", border: "none", height: "70vh", display: "block" }}
            />
          </div>

          {/* ── Validator Comments ───────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(20,83,45,0.04)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2.5 px-5 py-3" style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}>
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 14, color: "#166534" }} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Validator Notes</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{comments.length} note{comments.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Comment list */}
            <div
              ref={listRef}
              className="overflow-y-auto px-5 py-4"
              style={{ maxHeight: 320, background: "#fafafa" }}
            >
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 28, color: "#cbd5e1" }} />
                  <p className="text-[12px] text-slate-400">No validator notes yet. Add one below.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {comments.map((c) => {
                    const bg = nameToColor(c.user.name);
                    return (
                      <div
                        key={c.id}
                        className="flex items-start gap-3 rounded-xl p-3"
                        style={{ background: "#fff", border: "1.5px solid #e5e7eb" }}
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ background: bg }}
                        >
                          {getInitials(c.user.name)}
                        </div>
                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[12px] font-bold text-slate-700">{c.user.name}</span>
                            <span className="text-[10px] text-slate-400">{c.user.email}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 leading-relaxed">{c.comment}</p>
                          <div className="mt-1 flex items-center gap-1">
                            <AccessTimeRoundedIcon sx={{ fontSize: 11, color: "#94a3b8" }} />
                            <span className="text-[10px] text-slate-400">
                              {new Date(c.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: "1.5px solid #e5e7eb" }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Add a validator note… (Enter to send, Shift+Enter for new line)"
                rows={3}
                className="w-full resize-none rounded-xl px-4 py-3 text-[13px] text-slate-700 outline-none transition-all placeholder:text-slate-400"
                style={{
                  border: "1.5px solid #e5e7eb",
                  background: "#f8fafc",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#166534")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-slate-400">
                  Notes are visible to all validators and admins.
                </p>
                <button
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-bold transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #14532d, #166534)",
                    color: "#fff",
                    boxShadow: "0 3px 10px rgba(20,83,45,0.25)",
                  }}
                >
                  <SendRoundedIcon sx={{ fontSize: 13 }} />
                  {submitting ? "Sending…" : "Send Note"}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 pb-4">
          <div className="h-5 w-5 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}>
            <ForestOutlinedIcon sx={{ fontSize: 12, color: "#fff" }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">DENR CENRO · Official Permit Record</span>
        </div>

      </div>
    </div>
  );
}
