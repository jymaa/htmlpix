"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface TemplatePreviewPaneProps {
  imageUrl: string | null;
  width: number;
  height: number;
  isRendering: boolean;
  error: string | null;
  renderMs: number | null;
}

export function TemplatePreviewPane({
  imageUrl,
  width,
  height,
  isRendering,
  error,
  renderMs,
}: TemplatePreviewPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = useMemo(() => {
    if (size.width === 0 || size.height === 0 || width <= 0 || height <= 0) {
      return 1;
    }
    const scaleX = (size.width - 48) / width;
    const scaleY = (size.height - 48) / height;
    return Math.max(0.05, Math.min(scaleX, scaleY, 1));
  }, [height, size.height, size.width, width]);

  return (
    <div className="relative flex h-full min-h-0 flex-col border border-[var(--border)]">
      <div className="flex h-10 items-center justify-between border-b border-[var(--border)] px-3">
        <span className="text-sm">Preview</span>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>
            {width}x{height}
          </span>
          {renderMs !== null && <span>{Math.round(renderMs)}ms</span>}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12px 12px, rgba(0,0,0,0.11) 1px, transparent 0), radial-gradient(circle at 36px 36px, rgba(0,0,0,0.08) 1px, transparent 0)",
          backgroundSize: "48px 48px",
          backgroundColor: "var(--muted)",
        }}
      >
        {imageUrl ? (
          <div
            className="absolute top-1/2 left-1/2 overflow-hidden border border-[var(--border)] bg-white shadow-sm"
            style={{
              width: width * scale,
              height: height * scale,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Blob URLs are generated at runtime from server-rendered preview bytes. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Template preview"
              className="pointer-events-none block select-none"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                maxWidth: "none",
                maxHeight: "none",
              }}
            />
          </div>
        ) : (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm">
            Waiting for first preview render...
          </div>
        )}

        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <div className="rounded border border-[var(--border)] bg-white px-2 py-1 text-xs">Rendering...</div>
          </div>
        )}

        {error && (
          <div className="absolute right-3 bottom-3 left-3 rounded border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="absolute top-3 right-3 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
}
