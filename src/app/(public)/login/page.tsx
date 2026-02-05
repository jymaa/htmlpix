"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="mb-8 text-4xl font-bold">Sign In</h1>
        <div className="flex max-w-sm flex-col gap-4">
          <Button onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}>
            Sign in with Google
          </Button>
        </div>
      </main>
    </>
  );
}
