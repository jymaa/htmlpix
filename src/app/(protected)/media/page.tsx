"use client";

import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type Render = {
  _id: string;
  _creationTime: number;
  apiKeyId: string;
  userId: string;
  externalId: string;
  status: "success" | "error";
  htmlHash: string;
  contentHash?: string;
  format: string;
  renderMs: number;
  imageKey?: string;
  imageUrl?: string;
  createdAt: number;
};

export default function MediaPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [statusFilter, setStatusFilter] = useState<"success" | "error" | "">("");
  const [formatFilter, setFormatFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRender, setSelectedRender] = useState<Render | null>(null);
  const [copied, setCopied] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.apiKeys.getUserRendersPaginated,
    userId
      ? {
          userId,
          statusFilter: statusFilter || undefined,
          formatFilter: formatFilter || undefined,
        }
      : "skip",
    { initialNumItems: 24 }
  );

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = status === "LoadingFirstPage";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media</h1>
          <p className="text-muted-foreground">Browse your rendered images</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center border">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              GRID
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                viewMode === "list"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LIST
            </button>
          </div>

          {/* Filters */}
          <Select
            value={statusFilter || "all"}
            onValueChange={(v) => setStatusFilter(v === "all" ? "" : (v as "success" | "error"))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formatFilter || "all"} onValueChange={(v) => setFormatFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" : "space-y-2"
          }
        >
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className={viewMode === "grid" ? "aspect-video w-full" : "h-16 w-full"} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && results.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="border-muted-foreground/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-dashed">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
              >
                <rect x="3" y="3" width="18" height="18" rx="0" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              No renders yet. Make your first API call to see images here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grid view */}
      {!isLoading && results.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((render) => (
            <button
              key={render._id}
              onClick={() => setSelectedRender(render as Render)}
              className="group bg-card hover:border-foreground/30 focus:ring-ring relative overflow-hidden border text-left transition-all focus:ring-2 focus:outline-none"
            >
              {/* Thumbnail */}
              <div className="bg-muted/30 relative aspect-video w-full overflow-hidden">
                {render.imageUrl ? (
                  <Image
                    src={render.imageUrl}
                    alt={`Render ${render.externalId}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-muted-foreground/40"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="0" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
                {/* Status overlay */}
                {render.status === "error" && (
                  <div className="bg-destructive/20 absolute inset-0 flex items-center justify-center">
                    <Badge variant="destructive" className="text-[10px]">
                      ERROR
                    </Badge>
                  </div>
                )}
              </div>
              {/* Meta strip */}
              <div className="flex items-center justify-between px-2.5 py-2">
                <span className="text-muted-foreground font-mono text-[11px]">
                  {render.externalId.slice(0, 8)}
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="h-5 px-1.5 font-mono text-[10px] uppercase">
                    {render.format}
                  </Badge>
                  <span className="text-muted-foreground font-mono text-[10px]">{render.renderMs}ms</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* List view */}
      {!isLoading && results.length > 0 && viewMode === "list" && (
        <div className="space-y-1">
          {/* List header */}
          <div className="text-muted-foreground grid grid-cols-[1fr_80px_80px_100px_140px] gap-4 border-b px-4 py-2 font-mono text-[10px] tracking-widest uppercase">
            <span>ID</span>
            <span>Format</span>
            <span>Status</span>
            <span>Time</span>
            <span>Date</span>
          </div>
          {results.map((render) => (
            <button
              key={render._id}
              onClick={() => setSelectedRender(render as Render)}
              className="hover:border-border hover:bg-muted/30 focus:ring-ring grid w-full grid-cols-[1fr_80px_80px_100px_140px] items-center gap-4 border-b border-transparent px-4 py-3 text-left transition-colors focus:ring-2 focus:outline-none"
            >
              <span className="truncate font-mono text-sm">{render.externalId}</span>
              <Badge variant="outline" className="w-fit font-mono text-[10px] uppercase">
                {render.format}
              </Badge>
              <Badge
                variant={render.status === "success" ? "default" : "destructive"}
                className="w-fit text-[10px]"
              >
                {render.status}
              </Badge>
              <span className="text-muted-foreground font-mono text-sm">{render.renderMs}ms</span>
              <span className="text-muted-foreground font-mono text-xs">{formatDate(render.createdAt)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Load More */}
      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => loadMore(24)}
            className="font-mono text-xs tracking-widest uppercase"
          >
            Load More
          </Button>
        </div>
      )}
      {status === "LoadingMore" && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" disabled className="font-mono text-xs tracking-widest uppercase">
            Loading...
          </Button>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedRender} onOpenChange={(open) => !open && setSelectedRender(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm font-normal tracking-wider">
              RENDER {selectedRender?.externalId}
            </DialogTitle>
          </DialogHeader>
          {selectedRender && (
            <div className="space-y-4">
              {/* Full image */}
              <div className="bg-muted/20 overflow-hidden border">
                {selectedRender.imageUrl ? (
                  <Image
                    src={selectedRender.imageUrl}
                    alt={`Render ${selectedRender.externalId}`}
                    className="max-h-[400px] w-full object-contain"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      {selectedRender.status === "error" ? "Render failed" : "Image not available"}
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Status
                  </span>
                  <div>
                    <Badge variant={selectedRender.status === "success" ? "default" : "destructive"}>
                      {selectedRender.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Format
                  </span>
                  <p className="font-mono uppercase">{selectedRender.format}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Render Time
                  </span>
                  <p className="font-mono">{selectedRender.renderMs}ms</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Date
                  </span>
                  <p className="font-mono text-sm">{formatDate(selectedRender.createdAt)}</p>
                </div>
                {selectedRender.imageKey && (
                  <div className="col-span-2 space-y-1">
                    <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                      Image Key
                    </span>
                    <p className="text-muted-foreground truncate font-mono text-xs">
                      {selectedRender.imageKey}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedRender.imageUrl && (
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() => handleCopyUrl(selectedRender.imageUrl!)}
                  >
                    {copied ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button variant="outline" size="sm" className="font-mono text-xs" asChild>
                    <a href={selectedRender.imageUrl} target="_blank" rel="noopener noreferrer">
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
