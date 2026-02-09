"use client";

import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api as _api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = _api as any;

type RenderEvent = {
  _id: string;
  userId: string;
  templateId: string;
  tv?: string;
  canonicalPath: string;
  contentHash: string;
  status: "success" | "error";
  cached: boolean;
  format: "png" | "jpeg" | "webp";
  renderMs: number;
  errorCode?: string;
  imageUrl?: string;
  createdAt: number;
  externalId: string;
};

export default function RendersPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [statusFilter, setStatusFilter] = useState<"success" | "error" | "">("");
  const [formatFilter, setFormatFilter] = useState("");
  const [cachedFilter, setCachedFilter] = useState<"all" | "cached" | "fresh">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEvent, setSelectedEvent] = useState<RenderEvent | null>(null);
  const [copied, setCopied] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.apiKeys.getUserRendersPaginated,
    userId
      ? {
          statusFilter: statusFilter || undefined,
          formatFilter: formatFilter || undefined,
          cachedFilter: cachedFilter === "all" ? undefined : cachedFilter === "cached",
        }
      : "skip",
    { initialNumItems: 24 }
  );

  const isLoading = status === "LoadingFirstPage";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Renders</h1>
          <p className="text-muted-foreground">Every request, including cached hits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              GRID
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LIST
            </button>
          </div>

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

          <Select value={cachedFilter} onValueChange={(v) => setCachedFilter(v as "all" | "cached" | "fresh") }>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Cache" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cache</SelectItem>
              <SelectItem value="cached">Cached</SelectItem>
              <SelectItem value="fresh">Fresh</SelectItem>
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

      {isLoading && (
        <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" : "space-y-2"}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className={viewMode === "grid" ? "aspect-video w-full" : "h-16 w-full"} />
          ))}
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No render activity yet.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && results.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((event: RenderEvent) => (
            <button
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="group bg-card hover:border-foreground/30 focus:ring-ring relative overflow-hidden border text-left transition-all focus:ring-2 focus:outline-none"
            >
              <div className="bg-muted/30 relative aspect-video w-full overflow-hidden">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={`Render ${event.externalId}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    {event.status === "error" ? "Error" : "No preview"}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-2.5 py-2">
                <span className="text-muted-foreground font-mono text-[11px]">{event.externalId}</span>
                <div className="flex items-center gap-1.5">
                  {event.cached && (
                    <Badge variant="secondary" className="h-5 px-1.5 font-mono text-[10px] uppercase">
                      Cached
                    </Badge>
                  )}
                  <Badge variant="outline" className="h-5 px-1.5 font-mono text-[10px] uppercase">
                    {event.format}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isLoading && results.length > 0 && viewMode === "list" && (
        <div className="space-y-1">
          <div className="text-muted-foreground grid grid-cols-[1fr_80px_80px_80px_100px_140px] gap-4 border-b px-4 py-2 font-mono text-[10px] tracking-widest uppercase">
            <span>ID</span>
            <span>Format</span>
            <span>Status</span>
            <span>Cache</span>
            <span>Time</span>
            <span>Date</span>
          </div>
          {results.map((event: RenderEvent) => (
            <button
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="hover:border-border hover:bg-muted/30 focus:ring-ring grid w-full grid-cols-[1fr_80px_80px_80px_100px_140px] items-center gap-4 border-b border-transparent px-4 py-3 text-left transition-colors focus:ring-2 focus:outline-none"
            >
              <span className="truncate font-mono text-sm">{event.externalId}</span>
              <Badge variant="outline" className="w-fit font-mono text-[10px] uppercase">{event.format}</Badge>
              <Badge variant={event.status === "success" ? "default" : "destructive"} className="w-fit text-[10px]">
                {event.status}
              </Badge>
              <Badge variant={event.cached ? "secondary" : "outline"} className="w-fit text-[10px]">
                {event.cached ? "cached" : "fresh"}
              </Badge>
              <span className="text-muted-foreground font-mono text-sm">{event.renderMs}ms</span>
              <span className="text-muted-foreground font-mono text-xs">{formatDate(event.createdAt)}</span>
            </button>
          ))}
        </div>
      )}

      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => loadMore(24)} className="font-mono text-xs tracking-widest uppercase">
            Load More
          </Button>
        </div>
      )}

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm font-normal tracking-wider">
              RENDER {selectedEvent?.externalId}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="bg-muted/20 overflow-hidden border">
                {selectedEvent.imageUrl ? (
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={`Render ${selectedEvent.externalId}`}
                    className="max-h-[400px] w-full object-contain"
                    width={400}
                    height={400}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <span className="text-muted-foreground text-sm">{selectedEvent.errorCode || "No image"}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Status</span>
                  <div>
                    <Badge variant={selectedEvent.status === "success" ? "default" : "destructive"}>{selectedEvent.status}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Cache</span>
                  <p className="font-mono text-sm uppercase">{selectedEvent.cached ? "cached" : "fresh"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Render Time</span>
                  <p className="font-mono">{selectedEvent.renderMs}ms</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Date</span>
                  <p className="font-mono text-sm">{formatDate(selectedEvent.createdAt)}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Path</span>
                  <p className="text-muted-foreground truncate font-mono text-xs">{selectedEvent.canonicalPath}</p>
                </div>
              </div>

              {selectedEvent.imageUrl && (
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() => handleCopyUrl(selectedEvent.imageUrl!)}
                  >
                    {copied ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button variant="outline" size="sm" className="font-mono text-xs" asChild>
                    <a href={selectedEvent.imageUrl} target="_blank" rel="noopener noreferrer">
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
