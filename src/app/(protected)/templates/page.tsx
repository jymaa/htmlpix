"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api as _api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

// TODO: Remove cast after running `convex dev` to regenerate types
const api = _api as any;
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Id } from "../../../../convex/_generated/dataModel";

type Template = {
  _id: Id<"templates">;
  _creationTime: number;
  userId: string;
  name: string;
  description?: string;
  html: string;
  css?: string;
  variables: { name: string; type: "string" | "number" | "url"; defaultValue?: string }[];
  width?: number;
  height?: number;
  format?: "png" | "jpeg" | "webp";
  isPublic: boolean;
  isStarter?: boolean;
  createdAt: number;
  updatedAt: number;
};

export default function TemplatesPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const userTemplates = useQuery(
    api.templates.listUserTemplates,
    userId ? { userId } : "skip"
  );
  const starterTemplates = useQuery(api.templates.listStarterTemplates);

  const createTemplate = useMutation(api.templates.createTemplate);
  const deleteTemplate = useMutation(api.templates.deleteTemplate);
  const cloneTemplate = useMutation(api.templates.cloneTemplate);

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [cloning, setCloning] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!userId || !newName.trim()) return;
    setCreating(true);
    try {
      const id = await createTemplate({
        userId,
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        html: "<div class=\"card\">\n  <h1>{{title}}</h1>\n  <p>{{subtitle}}</p>\n</div>",
        css: ".card {\n  padding: 60px;\n  background: #1a1a1a;\n  color: #f5f0e8;\n  font-family: system-ui;\n}",
        variables: [
          { name: "title", type: "string" as const, defaultValue: "Hello World" },
          { name: "subtitle", type: "string" as const, defaultValue: "Edit this template" },
        ],
        width: 1200,
        height: 630,
      });
      setNewName("");
      setNewDesc("");
      setCreateOpen(false);
      router.push(`/templates/${id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (templateId: Id<"templates">) => {
    if (!confirm("Delete this template permanently?")) return;
    await deleteTemplate({ templateId });
  };

  const handleClone = async (templateId: Id<"templates">) => {
    if (!userId) return;
    setCloning(templateId);
    try {
      const newId = await cloneTemplate({ templateId, userId });
      router.push(`/templates/${newId}`);
    } finally {
      setCloning(null);
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const isLoading = userTemplates === undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Reusable HTML/CSS templates with variable placeholders
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>New Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>
                Give your template a name. You&apos;ll edit the HTML/CSS next.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tmpl-name">Name</Label>
                <Input
                  id="tmpl-name"
                  placeholder="e.g., OG Image Card"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tmpl-desc">Description (optional)</Label>
                <Input
                  id="tmpl-desc"
                  placeholder="e.g., Dynamic OG image for blog posts"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Templates */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : userTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-dashed border-muted-foreground/30">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <p className="mb-1 font-medium">No templates yet</p>
            <p className="text-sm text-muted-foreground">
              Create one or clone a starter template below.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userTemplates.map((tmpl: Template) => (
            <Link
              key={tmpl._id}
              href={`/templates/${tmpl._id}`}
              className="group block"
            >
              <Card className="h-full transition-colors hover:border-foreground/30">
                <CardContent className="flex h-full flex-col justify-between p-4">
                  <div>
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-medium leading-tight group-hover:underline">
                        {tmpl.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(tmpl._id);
                        }}
                        className="shrink-0 p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        title="Delete template"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                    {tmpl.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {tmpl.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    {tmpl.format && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase"
                      >
                        {tmpl.format}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {tmpl.variables.length} var
                      {tmpl.variables.length !== 1 ? "s" : ""}
                    </Badge>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {formatDate(tmpl.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Starter Templates */}
      {starterTemplates && starterTemplates.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Starter Templates</h2>
            <p className="text-sm text-muted-foreground">
              Clone these to get started quickly
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {starterTemplates.map((tmpl: Template) => (
              <Card key={tmpl._id} className="h-full">
                <CardContent className="flex h-full flex-col justify-between p-4">
                  <div>
                    <h3 className="mb-1 font-medium">{tmpl.name}</h3>
                    {tmpl.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {tmpl.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {tmpl.format && (
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] uppercase"
                        >
                          {tmpl.format}
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px]"
                      >
                        {tmpl.variables.length} var
                        {tmpl.variables.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                      onClick={() => handleClone(tmpl._id)}
                      disabled={cloning === tmpl._id}
                    >
                      {cloning === tmpl._id ? "Cloning..." : "Clone"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
