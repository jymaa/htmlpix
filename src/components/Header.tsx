"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          HTMLPix
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/api-keys" className="hover:underline">
                API Keys
              </Link>
              <Button variant="outline" onClick={() => authClient.signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
