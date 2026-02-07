import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("relative overflow-hidden bg-[#1a1a1a]/[0.04]", className)}
      {...props}
    >
      {/* Blueprint scanline sweep */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,77,0,0.06) 40%, rgba(255,77,0,0.10) 50%, rgba(255,77,0,0.06) 60%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "skeletonSweep 1.8s ease-in-out infinite",
        }}
      />
      {/* Faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,1) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
      <style>{`
        @keyframes skeletonSweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export { Skeleton };
