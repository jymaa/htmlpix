"use client";

import { useState, useEffect, useRef } from "react";
import { usePaginatedQuery } from "convex/react";
import { api as _api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = _api as any;

type RenderEvent = {
  _id: string;
  userId: string;
  templateId: string;
  templateName: string;
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

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDateGroup(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0 && now.getDate() === date.getDate()) return "Today";
  if (diffDays <= 1 && now.getDate() - date.getDate() === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function StatusDot({ status }: { status: "success" | "error" }) {
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
        status === "success" ? "bg-emerald-500" : "bg-red-500"
      }`}
    />
  );
}

function LogRow({ event, isExpanded, onToggle }: { event: RenderEvent; isExpanded: boolean; onToggle: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border-b border-transparent transition-colors hover:bg-[var(--muted)]/30">
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-[80px_20px_1fr_80px_64px_72px_72px] items-center gap-3 px-4 py-2.5 text-left font-mono text-[13px]"
      >
        <span className="text-muted-foreground tabular-nums">{formatTime(event.createdAt)}</span>
        <StatusDot status={event.status} />
        <span className="truncate text-foreground">{event.templateName}</span>
        <span className="text-muted-foreground uppercase">{event.format}</span>
        <span className="text-right text-muted-foreground tabular-nums">
          {event.cached ? (
            <span className="text-sky-500">cache</span>
          ) : (
            `${event.renderMs}ms`
          )}
        </span>
        <span className="text-right text-muted-foreground">
          {event.status === "error" ? (
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">ERR</Badge>
          ) : event.cached ? (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">HIT</Badge>
          ) : (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">MISS</Badge>
          )}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-muted-foreground ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div className="bg-muted/20 border-t px-4 py-4">
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 font-mono text-[12px] sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Status</span>
              <span className={event.status === "success" ? "text-emerald-500" : "text-red-500"}>
                {event.status}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Format</span>
              <span>{event.format}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Render Time</span>
              <span>{event.cached ? "0ms (cached)" : `${event.renderMs}ms`}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Cache</span>
              <span>{event.cached ? "HIT" : "MISS"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Template ID</span>
              <span className="text-muted-foreground">{event.templateId}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Content Hash</span>
              <span className="text-muted-foreground">{event.contentHash}</span>
            </div>
            {event.errorCode && (
              <div className="col-span-2">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Error Code</span>
                <span className="text-red-500">{event.errorCode}</span>
              </div>
            )}
            {event.canonicalPath && (
              <div className="col-span-full">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Path</span>
                <span className="text-muted-foreground break-all text-[11px]">{event.canonicalPath}</span>
              </div>
            )}
          </div>
          {event.imageUrl && (
            <div className="mt-4 flex gap-2 border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                className="h-7 font-mono text-[11px]"
                onClick={(e) => handleCopy(e, event.imageUrl!)}
              >
                {copied ? "Copied" : "Copy URL"}
              </Button>
              <Button variant="outline" size="sm" className="h-7 font-mono text-[11px]" asChild>
                <a href={event.imageUrl} target="_blank" rel="noopener noreferrer">
                  Open Image
                </a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RendersPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [statusFilter, setStatusFilter] = useState<"success" | "error" | "">("");
  const [formatFilter, setFormatFilter] = useState("");
  const [cachedFilter, setCachedFilter] = useState<"all" | "cached" | "fresh">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.apiKeys.getUserRendersPaginated,
    userId
      ? {
          statusFilter: statusFilter || undefined,
          formatFilter: formatFilter || undefined,
          cachedFilter: cachedFilter === "all" ? undefined : cachedFilter === "cached",
        }
      : "skip",
    { initialNumItems: 50 }
  );

  const isLoading = status === "LoadingFirstPage";

  // Auto-scroll to top when new items arrive while live
  const prevCount = useRef(results.length);
  useEffect(() => {
    if (isLive && results.length > prevCount.current && listRef.current) {
      listRef.current.scrollTop = 0;
    }
    prevCount.current = results.length;
  }, [results.length, isLive]);

  // Group events by date
  const grouped: { label: string; events: RenderEvent[] }[] = [];
  let currentKey = "";
  for (const event of results as RenderEvent[]) {
    const key = getDateKey(event.createdAt);
    if (key !== currentKey) {
      currentKey = key;
      grouped.push({ label: formatDateGroup(event.createdAt), events: [] });
    }
    grouped[grouped.length - 1].events.push(event);
  }

  const filterChip = (
    label: string,
    active: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Logs</h1>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
              isLive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : "border-border text-muted-foreground"
            }`}
          >
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
            {isLive ? "Live" : "Paused"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 pb-4">
        {filterChip("All", !statusFilter && !formatFilter && cachedFilter === "all", () => {
          setStatusFilter("");
          setFormatFilter("");
          setCachedFilter("all");
        })}
        <span className="border-border self-center border-l h-4" />
        {filterChip("Success", statusFilter === "success", () =>
          setStatusFilter(statusFilter === "success" ? "" : "success")
        )}
        {filterChip("Error", statusFilter === "error", () =>
          setStatusFilter(statusFilter === "error" ? "" : "error")
        )}
        <span className="border-border self-center border-l h-4" />
        {filterChip("Cached", cachedFilter === "cached", () =>
          setCachedFilter(cachedFilter === "cached" ? "all" : "cached")
        )}
        {filterChip("Fresh", cachedFilter === "fresh", () =>
          setCachedFilter(cachedFilter === "fresh" ? "all" : "fresh")
        )}
        <span className="border-border self-center border-l h-4" />
        {filterChip("PNG", formatFilter === "png", () =>
          setFormatFilter(formatFilter === "png" ? "" : "png")
        )}
        {filterChip("JPEG", formatFilter === "jpeg", () =>
          setFormatFilter(formatFilter === "jpeg" ? "" : "jpeg")
        )}
        {filterChip("WebP", formatFilter === "webp", () =>
          setFormatFilter(formatFilter === "webp" ? "" : "webp")
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[80px_20px_1fr_80px_64px_72px_72px] items-center gap-3 border-b px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        <span>Time</span>
        <span />
        <span>Template</span>
        <span>Format</span>
        <span className="text-right">Speed</span>
        <span className="text-right">Cache</span>
        <span />
      </div>

      {/* Log list */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-1 p-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="border-muted-foreground/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-muted-foreground font-mono text-sm">No render events yet</p>
            <p className="text-muted-foreground mt-1 text-xs">Events will appear here when you start rendering</p>
          </div>
        )}

        {!isLoading &&
          grouped.map((group) => (
            <div key={group.label}>
              <div className="bg-background/80 sticky top-0 z-10 border-b px-4 py-1.5 backdrop-blur-sm">
                <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
                  {group.label}
                </span>
              </div>
              {group.events.map((event) => (
                <LogRow
                  key={event._id}
                  event={event}
                  isExpanded={expandedId === event._id}
                  onToggle={() => setExpandedId(expandedId === event._id ? null : event._id)}
                />
              ))}
            </div>
          ))}

        {status === "CanLoadMore" && (
          <div className="flex justify-center py-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMore(50)}
              className="font-mono text-[11px] uppercase tracking-wider"
            >
              Load older events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
