"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type UploadMode = "file" | "url";

interface ImageUploadProps {
  /** Current image URL (controlled) */
  value?:       string;
  /** Called with the final CDN URL after upload or URL input */
  onChange:     (url: string) => void;
  /** Auth token for presigned URL endpoint */
  accessToken?: string;
  /** Accepted MIME types */
  accept?:      string;
  /** Max file size in bytes (default 10 MB) */
  maxBytes?:    number;
  /** Label shown above the component */
  label?:       string;
  /** Fixed aspect ratio class, e.g. "aspect-video" or "aspect-square" */
  aspectClass?: string;
  /** Whether to show the URL input tab */
  allowUrl?:    boolean;
}

export function ImageUpload({
  value,
  onChange,
  accessToken,
  accept       = "image/jpeg,image/png,image/webp,image/avif",
  maxBytes     = 10 * 1024 * 1024,
  label        = "Image",
  aspectClass  = "aspect-video",
  allowUrl     = true,
}: ImageUploadProps) {
  const inputRef               = useRef<HTMLInputElement>(null);
  const [mode, setMode]        = useState<UploadMode>("file");
  const [urlInput, setUrlInput] = useState(value ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError]      = useState("");
  const [dragOver, setDragOver] = useState(false);

  // ── Upload a File object to R2 via presigned URL ─────────────────
  const uploadFile = useCallback(async function uploadFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted."); return;
    }
    if (file.size > maxBytes) {
      setError(`File too large. Maximum size is ${Math.round(maxBytes / 1024 / 1024)} MB.`); return;
    }

    setUploading(true);
    try {
      // 1. Get presigned upload URL from backend
      const presignRes = await fetch(`${API}/upload/presigned`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          filename:    file.name,
          contentType: file.type,
          size:        file.size,
        }),
      });

      if (!presignRes.ok) {
        const data = await presignRes.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to get upload URL");
      }

      const json = await presignRes.json() as Record<string, unknown>;
      const uploadUrl = json.uploadUrl as string | undefined;
      const cdnUrl    = json.cdnUrl    as string | undefined;
      if (!uploadUrl || !cdnUrl) throw new Error("Invalid upload response from server");

      // 2. PUT file directly to R2 (or S3-compatible)
      const putRes = await fetch(uploadUrl, {
        method:  "PUT",
        headers: { "Content-Type": file.type },
        body:    file,
      });

      if (!putRes.ok) throw new Error("Upload to storage failed");

      onChange(cdnUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [accessToken, maxBytes, onChange]);

  // ── Drag & drop ───────────────────────────────────────────────────
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
  };

  const clear = () => {
    onChange("");
    setUrlInput("");
    setError("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
          {label}
        </p>
      )}

      {/* Preview */}
      {value ? (
        <div className={`relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-charcoal-50 dark:bg-charcoal-800 ${aspectClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            aria-label="Remove image"
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-950/80 text-white backdrop-blur-sm hover:bg-red-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        /* Upload zone */
        <>
          {/* Hidden file input — lives outside the drop zone to avoid nested interactive controls */}
          <input
            ref={inputRef}
            id="image-upload-input"
            type="file"
            accept={accept}
            aria-label={`Upload ${label}`}
            onChange={onFileChange}
            className="sr-only"
          />
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload image — click or drag and drop"
            onClick={() => mode === "file" && inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && mode === "file" && inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={[
              `relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer ${aspectClass}`,
              dragOver
                ? "border-gold bg-gold/5"
                : "border-black/12 dark:border-white/12 bg-charcoal-50/50 dark:bg-charcoal-800/50 hover:border-gold/50 hover:bg-gold/3",
            ].join(" ")}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 mb-3">
                  <ImageIcon className="h-5 w-5 text-gold" />
                </div>
                <p className="font-sans text-sm text-charcoal/60 dark:text-cream/60 text-center px-4">
                  <span className="font-medium text-charcoal dark:text-cream">Click to upload</span>
                  {" "}or drag and drop
                </p>
                <p className="font-sans text-[11px] text-charcoal/35 dark:text-cream/35 mt-1">
                  PNG, JPG, WebP · max {Math.round(maxBytes / 1024 / 1024)} MB
                </p>
              </>
            )}
          </div>
        </>
      )}

      {/* Mode tabs */}
      {allowUrl && !value && (
        <div className="flex gap-1 pt-1">
          <TabButton active={mode === "file"} onClick={() => setMode("file")}>
            <Upload className="h-3 w-3" /> Upload file
          </TabButton>
          <TabButton active={mode === "url"} onClick={() => setMode("url")}>
            <LinkIcon className="h-3 w-3" /> Paste URL
          </TabButton>
        </div>
      )}

      {/* URL input */}
      {mode === "url" && !value && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-charcoal-900 px-3 py-2 font-sans text-sm text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:border-gold/60 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={applyUrl}
            disabled={!urlInput.trim()}
            className="shrink-0 rounded-lg bg-gold px-4 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal-950 hover:bg-gold-400 disabled:opacity-40 transition-colors"
          >
            Use
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="font-sans text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

function TabButton({
  active, onClick, children,
}: {
  active:   boolean;
  onClick:  () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] tracking-[0.1em] uppercase transition-colors",
        active
          ? "bg-charcoal-950 dark:bg-cream text-cream dark:text-charcoal-950"
          : "text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
