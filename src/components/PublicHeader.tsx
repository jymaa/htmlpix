"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function PublicHeader() {
  const { data: session } = authClient.useSession();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-[#f5f0e8]/80 font-[family-name:var(--font-space-mono)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center border-2 border-[#1a1a1a]">
            <span className="font-bold text-[#1a1a1a]">{"<>"}</span>
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#ff4d00]" />
          </div>
          <div>
            <div className="text-xs tracking-widest text-[#1a1a1a]/40 uppercase">Project</div>
            <div className="font-bold tracking-wider">HTMLPIX</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 text-xs tracking-widest uppercase md:flex md:gap-8">
          <>
            <Link
              href="/#spec"
              className="flex items-center gap-2 text-[#1a1a1a]/50 transition-colors hover:text-[#ff4d00]"
            >
              <span className="h-1 w-1 bg-current" />
              Specifications
            </Link>
            <Link
              href="/#pricing"
              className="flex items-center gap-2 text-[#1a1a1a]/50 transition-colors hover:text-[#ff4d00]"
            >
              <span className="h-1 w-1 bg-current" />
              Pricing
            </Link>
          </>
          <Link
            href="/docs"
            className="flex items-center gap-2 text-[#1a1a1a]/50 transition-colors hover:text-[#ff4d00]"
          >
            <span className="h-1 w-1 bg-current" />
            Docs
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-[#1a1a1a]/50 transition-colors hover:text-[#ff4d00]"
          >
            <span className="h-1 w-1 bg-current" />
            Pricing
          </Link>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="border-2 border-[#1a1a1a] px-4 py-2 text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8] md:px-5"
          >
            {session ? "Dashboard" : "Sign In"} →
          </Link>
        </div>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6 text-[#1a1a1a]" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#f5f0e8]">
            <SheetHeader>
              <SheetTitle className="text-left font-bold tracking-wider">HTMLPIX</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 text-sm tracking-widest uppercase">
              <>
                <Link
                  href="#spec"
                  className="rounded-md px-3 py-2.5 text-[#1a1a1a]/70 transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff4d00]"
                >
                  Specifications
                </Link>
                <Link
                  href="#pricing"
                  className="rounded-md px-3 py-2.5 text-[#1a1a1a]/70 transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff4d00]"
                >
                  Pricing
                </Link>
              </>
              <Link
                href="/docs"
                className="rounded-md px-3 py-2.5 text-[#1a1a1a]/70 transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff4d00]"
              >
                Docs
              </Link>
              <Link
                href="/pricing"
                className="rounded-md px-3 py-2.5 text-[#1a1a1a]/70 transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff4d00]"
              >
                Pricing
              </Link>
              <div className="mt-3 px-3">
                <Link
                  href={session ? "/dashboard" : "/login"}
                  className="block border-2 border-[#1a1a1a] px-5 py-3 text-center text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
                >
                  {session ? "Dashboard" : "Sign In"} →
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
