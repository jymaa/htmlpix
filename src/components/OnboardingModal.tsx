"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface OnboardingModalProps {
  userId: string;
  open: boolean;
  onComplete: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.htmlpix.com";

export function OnboardingModal({ userId, open, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [keyName, setKeyName] = useState("My First Key");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createKey = useMutation(api.apiKeys.createKey);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const handleCreateKey = async () => {
    if (!keyName.trim()) return;

    setLoading(true);
    try {
      const result = await createKey({ userId, name: keyName });
      setCreatedKey(result.rawKey);
      setStep(3);
    } catch (error) {
      console.error("Failed to create key:", error);
      setErrorMessage("Failed to create API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = async () => {
    if (!createdKey) return;
    await navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding({ userId });
    } catch (error) {
      console.error("Failed to mark onboarding complete:", error);
    }
    onComplete();
  };

  return (
    <>
      <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>Welcome to HTMLPix!</DialogTitle>
                <DialogDescription>
                  Let&apos;s get you set up with your first API key in just a few steps.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted/50 rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">What you&apos;ll be able to do:</h4>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <svg
                        className="text-primary mt-0.5 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Convert any HTML/CSS to pixel-perfect images
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="text-primary mt-0.5 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Generate OG images, social cards, and more
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="text-primary mt-0.5 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Sub-200ms render times with global CDN
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>Get Started</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <DialogHeader>
                <DialogTitle>Create Your API Key</DialogTitle>
                <DialogDescription>
                  API keys authenticate your requests. Give it a name to remember what it&apos;s for.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production, Development, My App"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleCreateKey} disabled={loading || !keyName.trim()}>
                  {loading ? "Creating..." : "Create Key"}
                </Button>
              </div>
            </>
          )}

          {step === 3 && createdKey && (
            <>
              <DialogHeader>
                <DialogTitle>Your API Key is Ready!</DialogTitle>
                <DialogDescription>
                  Copy your key now - you won&apos;t be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-lg border bg-amber-50 p-3 dark:bg-amber-950">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Save this key securely. For security, it will only be shown once.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={createdKey}
                      className="flex-1 font-mono text-sm"
                      onFocus={(e) => e.target.select()}
                    />
                    <Button variant="outline" onClick={handleCopyKey}>
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Quick Test</h4>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Try this curl command to make your first render:
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">
                    {`curl -X POST ${API_BASE_URL}/render \\
  -H "Authorization: Bearer ${createdKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello!</h1>"}' \\
  --output test.png`}
                  </pre>
                </div>
              </div>
              <div className="flex justify-between">
                <Link href="/docs">
                  <Button variant="ghost">View Docs</Button>
                </Link>
                <Button onClick={handleComplete}>Go to Dashboard</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
