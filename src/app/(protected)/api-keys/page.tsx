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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
              Copy your API key now. You won't be able to see it again.
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
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{key.name}</span>
                      <Badge variant={key.active ? "default" : "secondary"}>
                        {key.active ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <code>{key.keyPrefix}...</code>
                      <span>Created {new Date(key.createdAt).toLocaleDateString()}</span>
                      {key.revokedAt && <span>Revoked {new Date(key.revokedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
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
