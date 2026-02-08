"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { BlueprintSpinner } from "@/components/ui/blueprint-spinner";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<"google" | "email" | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading("google");
    await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading("email");
    try {
      await authClient.signIn.magicLink({ email, callbackURL: "/dashboard" });
      setEmailSent(true);
    } catch {
      setIsLoading(null);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,26,26,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,26,26,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        }}
      />

      {/* Corner markers */}
      <div className="fixed top-4 left-4 z-50 h-8 w-8 border-t-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed top-4 right-4 z-50 h-8 w-8 border-t-2 border-r-2 border-[#1a1a1a]/20" />
      <div className="fixed bottom-4 left-4 z-50 h-8 w-8 border-b-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed right-4 bottom-4 z-50 h-8 w-8 border-r-2 border-b-2 border-[#1a1a1a]/20" />

      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 bg-[#f5f0e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center border-2 border-[#1a1a1a]">
              <span className="font-bold text-[#1a1a1a]">{"</>"}</span>
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#ff4d00]" />
            </div>
            <div>
              <div className="text-xs tracking-widest text-[#1a1a1a]/40 uppercase">Project</div>
              <div className="font-bold tracking-wider">HTMLPIX</div>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs tracking-widest text-[#1a1a1a]/50 uppercase transition-colors hover:text-[#ff4d00]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative z-10 flex min-h-screen items-center px-4 pt-24 pb-12 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left side - Info */}
            <div className="flex flex-col justify-center">
              {/* Technical annotation */}
              <div className="mb-6 flex items-center gap-4 md:mb-8">
                <div className="h-0.5 w-12 bg-gradient-to-r from-[#ff4d00] to-transparent" />
                <span className="text-xs tracking-widest text-[#ff4d00] uppercase">ACCESS PORTAL</span>
              </div>

              <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-4xl leading-tight tracking-tight sm:text-5xl md:mb-8 md:text-6xl">
                <span className="text-[#ff4d00]">GET YOUR</span>
                <br />
                <span>API KEY</span>
              </h1>

              <div className="relative mb-8 border-l-2 border-[#1a1a1a]/20 pl-6 md:mb-12 md:pl-8">
                <div className="absolute top-0 left-0 h-2 w-2 -translate-x-[5px] bg-[#ff4d00]" />
                <p className="max-w-md text-base leading-relaxed text-[#1a1a1a]/60 md:text-lg">
                  Sign in to grab your API key and start rendering. Your dashboard tracks every request.
                </p>
              </div>

              {/* What happens after login */}
              <div className="border-2 border-[#1a1a1a]/10 bg-white/30 backdrop-blur-sm">
                <div className="border-b border-[#1a1a1a]/10 px-4 py-3 md:px-6">
                  <span className="text-xs tracking-widest text-[#1a1a1a]/40 uppercase">After Sign In</span>
                </div>
                <div className="grid gap-0 divide-y divide-[#1a1a1a]/10 md:grid-cols-2 md:divide-x md:divide-y-0">
                  {[
                    {
                      step: "01",
                      title: "Get API Key",
                      desc: "Copy your key and start building",
                    },
                    {
                      step: "02",
                      title: "Start Rendering",
                      desc: "One fetch call turns any HTML into an image",
                    },
                    { step: "03", title: "Track Usage", desc: "See every render, response time, and error" },
                    { step: "04", title: "Scale Up", desc: "Go from 50 to 10,000 renders/month" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 md:p-5">
                      <span className="text-xs font-bold text-[#ff4d00]">{item.step}</span>
                      <div>
                        <div className="text-sm font-bold text-[#1a1a1a]">{item.title}</div>
                        <div className="text-xs text-[#1a1a1a]/50">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Form container */}
                <div className="relative border-2 border-[#1a1a1a] bg-white">
                  {/* Top accent */}
                  <div className="absolute -top-1 right-8 left-8 h-1 bg-[#ff4d00]" />

                  {/* Corner annotations */}
                  <div className="absolute -top-6 left-0 text-xs text-[#1a1a1a]/30">AUTH.01</div>
                  <div className="absolute -top-6 right-0 text-xs text-[#1a1a1a]/30">SECURE</div>

                  <div className="p-6 md:p-10">
                    {emailSent ? (
                      /* Email sent confirmation */
                      <div className="text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-[#ff4d00] bg-[#ff4d00]/10">
                          <svg
                            className="h-8 w-8 text-[#ff4d00]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                            />
                          </svg>
                        </div>
                        <h2 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide">
                          CHECK YOUR INBOX
                        </h2>
                        <p className="mb-6 text-sm text-[#1a1a1a]/60">
                          We sent a magic link to <span className="font-bold text-[#1a1a1a]">{email}</span>
                        </p>
                        <button
                          onClick={() => {
                            setEmailSent(false);
                            setIsLoading(null);
                          }}
                          className="text-xs tracking-widest text-[#ff4d00] uppercase transition-colors hover:text-[#1a1a1a]"
                        >
                          ← Use a different email
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-8 text-center">
                          <h2 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
                            SIGN IN
                          </h2>
                          <p className="text-sm text-[#1a1a1a]/50">Takes 30 seconds. No credit card.</p>
                        </div>

                        {/* Google Sign In - Primary */}
                        <div className="mb-2">
                          <span className="text-xs tracking-widest text-[#ff4d00] uppercase">
                            Recommended
                          </span>
                        </div>
                        <button
                          onClick={handleGoogleSignIn}
                          disabled={isLoading !== null}
                          className="group relative mb-2 flex w-full items-center justify-center gap-3 bg-[#ff4d00] px-6 py-4 font-bold tracking-wider text-white uppercase transition-all hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoading === "google" ? (
                            <BlueprintSpinner size="sm" />
                          ) : (
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                          )}
                          <span className="text-sm">Continue with Google</span>
                          <div className="absolute right-4 opacity-0 transition-opacity group-hover:opacity-100">
                            →
                          </div>
                        </button>
                        <p className="mb-6 text-center text-xs text-[#1a1a1a]/40">
                          New users &amp; existing accounts
                        </p>

                        {/* Divider */}
                        <div className="relative my-6 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#1a1a1a]/10" />
                          </div>
                          <span className="relative bg-white px-4 text-xs tracking-widest text-[#1a1a1a]/30 uppercase">
                            OR
                          </span>
                        </div>

                        {/* Email Sign In */}
                        <form onSubmit={handleEmailSignIn}>
                          <div className="mb-4">
                            <label className="mb-2 block text-xs tracking-widest text-[#1a1a1a]/40 uppercase">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@company.com"
                              disabled={isLoading !== null}
                              className="w-full border-2 border-[#1a1a1a]/20 bg-transparent px-4 py-3 text-[#1a1a1a] placeholder-[#1a1a1a]/30 transition-colors focus:border-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isLoading !== null || !email}
                            className="group relative flex w-full items-center justify-center gap-3 border-2 border-[#1a1a1a] bg-white px-6 py-4 font-bold tracking-wider uppercase transition-all hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isLoading === "email" ? (
                              <BlueprintSpinner size="sm" />
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                            <span className="text-sm">Send Magic Link</span>
                            <div className="absolute right-4 opacity-0 transition-opacity group-hover:opacity-100">
                              →
                            </div>
                          </button>
                        </form>

                        {/* Info note */}
                        <p className="mt-6 text-center text-xs text-[#1a1a1a]/40">
                          No password needed. We&apos;ll email you a secure login link.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Bottom bar */}
                  <div className="flex justify-between border-t border-[#1a1a1a]/10 bg-[#f5f0e8]/50 px-6 py-3 text-xs text-[#1a1a1a]/30 md:px-10">
                    <span>256-bit encryption</span>
                    <span>SOC2 compliant</span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full border-2 border-[#1a1a1a]/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-xs text-[#1a1a1a]/30">By signing in, you agree to our <a href="/terms" className="underline transition-colors hover:text-[#ff4d00]">Terms</a> and <a href="/privacy" className="underline transition-colors hover:text-[#ff4d00]">Privacy Policy</a></span>
          <span className="text-xs text-[#1a1a1a]/20">v2.0</span>
        </div>
      </footer>
    </div>
  );
}
