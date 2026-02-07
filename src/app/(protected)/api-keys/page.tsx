"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function ApiKeysPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const apiKeys = useQuery(api.apiKeys.listUserKeys, userId ? { userId } : "skip");
  const createKey = useMutation(api.apiKeys.createKey);
  const revokeKey = useMutation(api.apiKeys.revokeKey);
  const deleteKey = useMutation(api.apiKeys.deleteKey);
  const reactivateKey = useMutation(api.apiKeys.reactivateKey);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!userId || !newKeyName.trim()) return;

    setIsLoading(true);
    try {
      const result = await createKey({ userId, name: newKeyName.trim() });
      setNewKeyValue(result.rawKey);
      setNewKeyName("");
      setIsCreateDialogOpen(false);
      setIsKeyDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (keyId: Id<"apiKeys">) => {
    await revokeKey({ keyId });
  };

  const handleReactivate = async (keyId: Id<"apiKeys">) => {
    await reactivateKey({ keyId });
  };

  const handleDelete = async (keyId: Id<"apiKeys">) => {
    if (confirm("Are you sure you want to permanently delete this API key?")) {
      await deleteKey({ keyId });
    }
  };

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Create and manage your API keys</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Give your API key a name to help you identify it later.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newKeyName.trim()) handleCreateKey();
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateKey} disabled={isLoading || !newKeyName.trim()}>
                {isLoading ? "Creating..." : "Create Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your New API Key</DialogTitle>
            <DialogDescription>
              Copy your API key now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted p-3 font-mono text-sm">{newKeyValue}</code>
              <Button variant="outline" size="sm" onClick={() => newKeyValue && copyToClipboard(newKeyValue)}>
                Copy
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsKeyDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Keys prefixed with hpx_ are used to authenticate API requests</CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys === undefined ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : apiKeys.length === 0 ? (
            <p className="text-muted-foreground">No API keys yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key._id}
                  className="flex items-center justify-between border p-4 transition-colors hover:bg-muted/20"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{key.name}</span>
                      <Badge variant={key.active ? "default" : "secondary"}>
                        {key.active ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {/* Copyable key prefix */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => copyToClipboard(key.keyPrefix, key._id)}
                            className="inline-flex items-center gap-1.5 font-mono transition-colors hover:text-foreground"
                          >
                            <code>{key.keyPrefix}...</code>
                            {copiedId === key._id ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedId === key._id ? "Copied!" : "Copy key prefix"}
                        </TooltipContent>
                      </Tooltip>
                      <span className="hidden sm:inline">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                      {key.revokedAt && (
                        <span className="hidden sm:inline">
                          Revoked {new Date(key.revokedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {key.active ? (
                      <Button variant="outline" size="sm" onClick={() => handleRevoke(key._id)}>
                        Revoke
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleReactivate(key._id)}>
                        Reactivate
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(key._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>How to use your API key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Authentication</h3>
            <p className="text-sm text-muted-foreground">Include your API key in the Authorization header:</p>
            <pre className="mt-2 rounded bg-muted p-3 text-sm">
              <code>Authorization: Bearer hpx_your_api_key</code>
            </pre>
          </div>
          <div>
            <h3 className="font-medium">Example Request</h3>
            <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-sm">
              <code>{`curl -X POST https://api.htmlpix.com/render \\
  -H "Authorization: Bearer hpx_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>"}'`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
