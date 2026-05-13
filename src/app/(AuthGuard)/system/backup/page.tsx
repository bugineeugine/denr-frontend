"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import axiosInstance from "@/utils/axiosInstance";
import { customToast } from "@/utils/customToast";
import ConfirmDialog from "@/components/ConfirmDialog";

type BackupFile = { name: string; size: number; created_at: string };

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const BackupPage = () => {
  const queryClient = useQueryClient();
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: React.ReactNode;
    tone: "primary" | "danger" | "success";
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    open: false, title: "", message: "", tone: "primary", confirmLabel: "Confirm", onConfirm: () => {},
  });
  const closeConfirm = () => setConfirmState((s) => ({ ...s, open: false }));

  const { data, isLoading } = useQuery({
    queryKey: ["backups"],
    queryFn: async () => (await axiosInstance.get("/backups")).data,
    retry: false,
  });

  const create = useMutation({
    mutationFn: async () => (await axiosInstance.post("/backups")).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const restore = useMutation({
    mutationFn: async (name: string) =>
      (await axiosInstance.post(`/backups/${encodeURIComponent(name)}/restore`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const destroy = useMutation({
    mutationFn: async (name: string) =>
      (await axiosInstance.delete(`/backups/${encodeURIComponent(name)}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      customToast(res.message);
    },
    onError: (e: any) => customToast(e?.response?.data?.message || e.message, "error"),
  });

  const downloadBackup = (name: string) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/backups/${encodeURIComponent(name)}/download`;
    window.open(url, "_blank");
  };

  const files: BackupFile[] = data?.data ?? [];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className="relative shrink-0 overflow-hidden px-6 py-5"
        style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 55%, #475569 100%)" }}
      >
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <BackupOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300/70">System</p>
              <h1 className="text-[18px] font-bold leading-tight text-white">Backup & Restore</h1>
            </div>
          </div>
          <Button
            onClick={() =>
              setConfirmState({
                open: true,
                title: "Create new backup?",
                message: "This will dump the current database to a new .sql file.",
                tone: "primary",
                confirmLabel: "Create Backup",
                onConfirm: () => {
                  create.mutate();
                  closeConfirm();
                },
              })
            }
            disabled={create.isPending}
            startIcon={<AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              px: 2.5,
              py: 1,
              "&:hover": { background: "rgba(255,255,255,0.24)" },
            }}
          >
            {create.isPending ? "Backing up…" : "New Backup"}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div
          className="rounded-2xl overflow-hidden bg-white"
          style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500"
               style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
            <div className="col-span-6">File</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Created</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {isLoading && (
            <div className="px-5 py-10 text-center text-[12px] text-slate-400">Loading…</div>
          )}

          {!isLoading && files.length === 0 && (
            <div className="px-5 py-12 text-center">
              <BackupOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
              <p className="mt-2 text-[13px] text-slate-500">No backups yet</p>
              <p className="text-[11px] text-slate-400">Click &ldquo;New Backup&rdquo; to create your first one.</p>
            </div>
          )}

          {files.map((f) => (
            <div
              key={f.name}
              className="grid grid-cols-12 px-5 py-3 items-center"
              style={{ borderBottom: "1px solid #f1f5f9" }}
            >
              <div className="col-span-6 truncate">
                <span className="text-[13px] font-semibold text-slate-700">{f.name}</span>
              </div>
              <div className="col-span-2 text-[12px] text-slate-500">{formatSize(f.size)}</div>
              <div className="col-span-3 text-[12px] text-slate-500">
                {new Date(f.created_at).toLocaleString()}
              </div>
              <div className="col-span-1 flex items-center justify-end gap-0.5">
                <Tooltip title="Download">
                  <IconButton size="small" onClick={() => downloadBackup(f.name)} sx={{ color: "#0369a1" }}>
                    <DownloadOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Restore">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setConfirmState({
                        open: true,
                        title: "Restore database?",
                        message: (
                          <>
                            This will overwrite the current database with <strong>{f.name}</strong>.
                            All current changes will be lost. Continue?
                          </>
                        ),
                        tone: "danger",
                        confirmLabel: "Restore",
                        onConfirm: () => {
                          restore.mutate(f.name);
                          closeConfirm();
                        },
                      })
                    }
                    sx={{ color: "#15803d" }}
                  >
                    <RestoreOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setConfirmState({
                        open: true,
                        title: "Delete backup?",
                        message: (
                          <>
                            Delete <strong>{f.name}</strong>? This cannot be undone.
                          </>
                        ),
                        tone: "danger",
                        confirmLabel: "Delete",
                        onConfirm: () => {
                          destroy.mutate(f.name);
                          closeConfirm();
                        },
                      })
                    }
                    sx={{ color: "#dc2626" }}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onConfirm={confirmState.onConfirm}
        onClose={closeConfirm}
      />
    </div>
  );
};

export default BackupPage;
