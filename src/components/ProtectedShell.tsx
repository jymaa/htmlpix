"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { DashboardHeader } from "@/components/DashboardHeader";
import { BlueprintSpinner } from "@/components/ui/blueprint-spinner";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const isTemplateEditorRoute = /^\/templates\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden font-[family-name:var(--font-space-mono)]"
        style={{ background: "#f5f0e8" }}
      >
        {/* Blueprint grid */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26,26,26,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26,26,26,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Corner markers */}
        <div className="fixed top-4 left-4 z-50 h-8 w-8 border-t-2 border-l-2 border-[#1a1a1a]/20" />
        <div className="fixed top-4 right-4 z-50 h-8 w-8 border-t-2 border-r-2 border-[#1a1a1a]/20" />
        <div className="fixed bottom-4 left-4 z-50 h-8 w-8 border-b-2 border-l-2 border-[#1a1a1a]/20" />
        <div className="fixed right-4 bottom-4 z-50 h-8 w-8 border-r-2 border-b-2 border-[#1a1a1a]/20" />

        <BlueprintSpinner size="lg" label="Initializing" className="relative z-10" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <ConvexClientProvider>
      <DashboardHeader />
      <main className={isTemplateEditorRoute ? "w-full p-4" : "container mx-auto p-4"}>{children}</main>
    </ConvexClientProvider>
  );
}
