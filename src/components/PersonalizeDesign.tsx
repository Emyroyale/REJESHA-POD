"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PersonalizationConfig } from "@/lib/personalization-config";

const DISPLAY_WIDTH = 480;

type NormalizedPoint = { x: number; y: number };

export type PersonalizeResult = { personalizationId: string; previewUrl: string };

export default function PersonalizeDesign({
  config,
  onReady,
  onClear,
}: {
  config: PersonalizationConfig;
  onReady: (result: PersonalizeResult) => void;
  onClear: () => void;
}) {
  const displayHeight = Math.round(
    (DISPLAY_WIDTH * config.output.height) / config.output.width
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const photoImageRef = useRef<HTMLImageElement | null>(null);

  // Bundled brand font, resolved to the family name next/font injected —
  // canvas's `font` setter doesn't reliably resolve CSS var() references.
  const [fontFamily, setFontFamily] = useState("sans-serif");

  const [text, setText] = useState("");
  const [textPos, setTextPos] = useState<NormalizedPoint>({ x: 0.5, y: 0.85 });
  const [fontRatio, setFontRatio] = useState(0.09);
  const [textTooLong, setTextTooLong] = useState(false);

  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoPos, setPhotoPos] = useState<NormalizedPoint>({ x: 0.5, y: 0.4 });
  const [photoScale, setPhotoScale] = useState(1);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);

  const [dragging, setDragging] = useState<"text" | "photo" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-archivo")
      .trim();
    if (resolved) setFontFamily(resolved);
  }, []);

  const draw = useCallback(
    (targetCanvas?: HTMLCanvasElement) => {
      const canvas = targetCanvas ?? canvasRef.current;
      const base = baseImageRef.current;
      if (!canvas || !base) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);

      const photo = photoImageRef.current;
      if (photo) {
        const baseSize = w * 0.5 * photoScale;
        const aspect = photo.naturalHeight / photo.naturalWidth;
        const pw = baseSize;
        const ph = baseSize * aspect;
        ctx.drawImage(photo, photoPos.x * w - pw / 2, photoPos.y * h - ph / 2, pw, ph);
      }

      if (text.trim()) {
        const fontSize = fontRatio * w;
        ctx.font = `700 ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = fontSize * 0.06;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const x = textPos.x * w;
        const y = textPos.y * h;
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
      }
    },
    [text, textPos, fontRatio, photoPos, photoScale, fontFamily]
  );

  // Load the base design once, same-origin so canvas export never taints.
  useEffect(() => {
    const img = new window.Image();
    img.src = config.baseDesignPath;
    img.onload = () => {
      baseImageRef.current = img;
      draw();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.baseDesignPath]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Auto-shrink text to fit within the canvas before it overflows.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas || !text.trim()) {
      setTextTooLong(false);
      return;
    }
    const maxWidth = canvas.width * 0.85;
    let size = config.text.maxFontSize;
    let width = 0;
    while (size >= config.text.minFontSize) {
      ctx.font = `700 ${size}px ${fontFamily}`;
      width = ctx.measureText(text).width;
      if (width <= maxWidth) break;
      size -= 4;
    }
    setFontRatio(size / canvas.width);
    setTextTooLong(width > maxWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontFamily]);

  function handlePhotoUpload(file: File) {
    if (file.size > config.photo.maxBytes) {
      setError("Photo is too large (max 10MB).");
      return;
    }
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      photoImageRef.current = img;
      if (img.naturalWidth < config.photo.minWidth || img.naturalHeight < config.photo.minHeight) {
        setPhotoWarning(
          "This photo may look blurry when printed — a higher-resolution image is recommended."
        );
      } else {
        setPhotoWarning(null);
      }
      setError(null);
      setPhotoLoaded(true);
      draw();
    };
    img.src = url;
  }

  function pointerToNormalized(e: React.PointerEvent<HTMLCanvasElement>): NormalizedPoint {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { x, y } = pointerToNormalized(e);
    const distToPhoto = photoImageRef.current ? Math.hypot(x - photoPos.x, y - photoPos.y) : Infinity;
    const distToText = text.trim() ? Math.hypot(x - textPos.x, y - textPos.y) : Infinity;
    if (distToPhoto === Infinity && distToText === Infinity) return;
    setDragging(distToPhoto <= distToText ? "photo" : "text");
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging) return;
    const { x, y } = pointerToNormalized(e);
    const clamped = { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
    if (dragging === "photo") setPhotoPos(clamped);
    else setTextPos(clamped);
    setReady(false);
  }

  function handlePointerUp() {
    setDragging(null);
  }

  async function handleUseDesign() {
    setUploading(true);
    setError(null);
    try {
      // Guarantee the bundled font is actually loaded before we bake it
      // into the exported print file, not just the on-screen preview.
      if (typeof document !== "undefined" && "fonts" in document) {
        await document.fonts.ready;
      }

      const output = document.createElement("canvas");
      output.width = config.output.width;
      output.height = config.output.height;
      draw(output);

      const blob: Blob | null = await new Promise((resolve) =>
        output.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) throw new Error("Could not generate the design image.");

      const formData = new FormData();
      formData.append("design", blob, "design.png");
      formData.append("productId", config.productId);
      formData.append(
        "configuration",
        JSON.stringify({
          text: text.trim() ? { value: text, ...textPos, fontRatio } : undefined,
          photo: photoImageRef.current ? { ...photoPos, scale: photoScale } : undefined,
        })
      );

      const res = await fetch("/api/personalize/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");

      setReady(true);
      onReady({ personalizationId: data.personalizationId, previewUrl: data.previewUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-8 border border-rejesha-black p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-rejesha-gray">
        Personalize This Shirt
      </p>

      <canvas
        ref={canvasRef}
        width={DISPLAY_WIDTH}
        height={displayHeight}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="mx-auto touch-none border border-rejesha-line bg-white"
        style={{ width: DISPLAY_WIDTH, height: displayHeight }}
      />

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-rejesha-gray">
            Add Your Text (optional)
          </label>
          <input
            type="text"
            value={text}
            maxLength={config.text.maxCharacters}
            onChange={(e) => {
              setText(e.target.value);
              setReady(false);
              onClear();
            }}
            placeholder="e.g. Cruise Squad 2026"
            className="w-full border border-rejesha-black px-3 py-2 text-sm"
          />
          <p className="mt-1 text-right text-xs text-rejesha-gray">
            {text.length}/{config.text.maxCharacters}
          </p>
          {textTooLong && (
            <p className="mt-1 text-xs text-rejesha-red">
              This text is too long to fit — try a shorter phrase.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-rejesha-gray">
            Add Your Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handlePhotoUpload(file);
                setReady(false);
                onClear();
              }
            }}
            className="w-full text-sm"
          />
          {photoLoaded && (
            <div className="mt-2">
              <label className="mb-1 block text-xs text-rejesha-gray">Photo Size</label>
              <input
                type="range"
                min={0.4}
                max={2}
                step={0.05}
                value={photoScale}
                onChange={(e) => {
                  setPhotoScale(Number(e.target.value));
                  setReady(false);
                  onClear();
                }}
                className="w-full"
              />
            </div>
          )}
          {photoWarning && <p className="mt-1 text-xs text-rejesha-red">{photoWarning}</p>}
        </div>

        <p className="text-xs text-rejesha-gray">
          Drag your text or photo directly on the preview above to reposition it.
        </p>

        {error && <p className="text-xs text-rejesha-red">{error}</p>}

        <button
          type="button"
          onClick={handleUseDesign}
          disabled={uploading || textTooLong || (!text.trim() && !photoLoaded)}
          className="w-full border-2 border-rejesha-black bg-rejesha-black py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rejesha-red hover:border-rejesha-red disabled:opacity-50"
        >
          {uploading ? "Saving Design…" : ready ? "Design Saved ✓" : "Use This Design"}
        </button>
      </div>
    </div>
  );
}
