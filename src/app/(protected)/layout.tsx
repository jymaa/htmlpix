import type { Metadata } from "next";
import { ProtectedShell } from "@/components/ProtectedShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
