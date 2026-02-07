"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/api-keys", label: "API Keys" },
  { href: "/playground", label: "Playground" },
  { href: "/media", label: "Media" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
];

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center border-2 border-foreground">
            <span className="text-sm font-bold">{"<>"}</span>
            <div className="absolute -top-1 -right-1 h-1.5 w-1.5 bg-[#ff4d00]" />
          </div>
          <span className="font-bold tracking-wide">HTMLPIX</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === link.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Settings link */}
          <div className="border-l border-border pl-4">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${
                  pathname === "/settings"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="text-left font-bold tracking-wide">
                HTMLPIX
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-foreground ${
                    pathname === link.href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                href="/settings"
                className={`flex items-center gap-2 text-sm transition-colors hover:text-foreground ${
                  pathname === "/settings"
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
