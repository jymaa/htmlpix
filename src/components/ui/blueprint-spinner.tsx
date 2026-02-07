import { cn } from "@/lib/utils";

/**
 * Blueprint-style loading spinner matching the HTMLPix design language.
 * - "sm" (16px): inline button / tight spaces
 * - "md" (24px, default): cards, preview panes
 * - "lg" (96px): full-page loading states
 */
export function BlueprintSpinner({
  size = "md",
  label,
  className,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}) {
  const dims = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-24 w-24" } as const;
  const tickSizes = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-3 w-3" } as const;
  const dotSizes = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-2 w-2" } as const;
  const borderWidth = size === "lg" ? "border-2" : "border";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative", dims[size])}>
        {/* Outer rotating frame */}
        <div
          className={cn("absolute inset-0 border-[#1a1a1a]/10", borderWidth)}
          style={{ animation: "bpRotate 8s linear infinite" }}
        />
        {/* Inner pulsing square */}
        <div
          className={cn(
            "absolute border-[#ff4d00]/40",
            borderWidth,
            size === "lg" ? "inset-3" : size === "md" ? "inset-1" : "inset-0.5"
          )}
          style={{ animation: "bpPulseBox 2s ease-in-out infinite" }}
        />
        {/* Crosshairs */}
        <div className="absolute top-1/2 right-0 left-0 h-px bg-[#1a1a1a]/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#1a1a1a]/10" />
        {/* Center dot */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 bg-[#ff4d00]",
            dotSizes[size]
          )}
          style={{ animation: "bpPulseDot 2s ease-in-out infinite" }}
        />
        {/* Corner ticks */}
        <div className={cn("absolute -top-px -left-px border-t border-l border-[#ff4d00]", tickSizes[size])} />
        <div className={cn("absolute -top-px -right-px border-t border-r border-[#ff4d00]", tickSizes[size])} />
        <div className={cn("absolute -bottom-px -left-px border-b border-l border-[#ff4d00]", tickSizes[size])} />
        <div className={cn("absolute -right-px -bottom-px border-r border-b border-[#ff4d00]", tickSizes[size])} />
      </div>

      {/* Scanline bar — only for md/lg */}
      {size !== "sm" && (
        <div
          className={cn(
            "relative overflow-hidden bg-[#1a1a1a]/5",
            size === "lg" ? "h-1 w-48" : "h-0.5 w-16"
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#ff4d00] to-transparent",
              size === "lg" ? "w-12" : "w-6"
            )}
            style={{ animation: "bpScan 1.5s ease-in-out infinite" }}
          />
        </div>
      )}

      {/* Label */}
      {label && (
        <div className="flex items-center gap-2">
          <div className="h-px w-4 bg-[#ff4d00]/30" />
          <span className="text-xs tracking-[0.2em] text-[#1a1a1a]/40 uppercase">
            {label}
          </span>
          <div className="h-px w-4 bg-[#ff4d00]/30" />
        </div>
      )}

      {/* Shared keyframes — deduped by the browser when multiple spinners render */}
      <style>{`
        @keyframes bpRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bpPulseBox {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes bpPulseDot {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }
        @keyframes bpScan {
          0% { left: -3rem; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
