/**
 * =============================================================================
 * COMPONENT — Top Bar
 * =============================================================================
 *
 * Sticky top bar with idea pill, session timer, and action buttons.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/lib/store/project-store";
import { Play, Download, Menu, Loader2, Sparkles } from "lucide-react";

interface TopbarProps {
  onExportPdf?: () => void;
  onExportNotion?: () => void;
  onRunAll?: () => void;
  onMenuClick?: () => void;
}

function getShortTagline(idea?: string, industry?: string): string {
  if (!idea) return industry || "AI Startup Intelligence";
  const cleaned = idea.replace(/^(an?|the)\s+(platform|app|toolkit|tool|service|system|software|solution)\s+(for|that|which)\s+/i, "");
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (capitalized.length <= 40) return capitalized;
  return capitalized.slice(0, 38).trim() + "…";
}

export function Topbar({ onExportPdf, onExportNotion, onRunAll, onMenuClick }: TopbarProps) {
  const input = useProjectStore((s) => s.input);
  const overallStatus = useProjectStore((s) => s.overallStatus);
  const isRunning = overallStatus === "in-progress";

  const startupName = input?.startupName || "Founders Orchestra";
  const tagline = getShortTagline(input?.idea, input?.industry);

  return (
    <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3.5 bg-fo-surface border-b border-border sticky top-0 z-40 w-full">
      {/* ── Mobile Hamburger Toggle ───────────────────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden flex items-center justify-center text-fo-sub hover:text-fo-text w-9 h-9 p-0 border border-border"
        onClick={onMenuClick}
      >
        <Menu size={16} />
      </Button>

      {/* ── Startup Header Pill ───────────────────────────────────────────── */}
      <Badge
        variant="outline"
        className="bg-[rgba(99,102,241,.12)] border-[rgba(99,102,241,.3)] text-[12px] sm:text-[13px] font-medium px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-2 max-w-[calc(100vw-180px)] sm:max-w-[480px] md:max-w-[600px]"
      >
        <div className="w-[6px] h-[6px] rounded-full bg-fo-indigo flex-shrink-0" />
        <span className="font-bold text-fo-text tracking-tight whitespace-nowrap flex-shrink-0">
          {startupName}
        </span>
        <span className="text-fo-muted font-normal text-xs">•</span>
        <span className="text-fo-sub font-normal text-xs truncate">
          {tagline}
        </span>
      </Badge>

      {/* ── Session timer (hidden on small screens) ───────────────────────── */}
      <span className="hidden sm:inline text-xs text-fo-muted">
        Session started just now
      </span>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 sm:gap-2.5 ml-auto items-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 sm:gap-2 text-fo-sky border-[rgba(14,165,233,.3)] bg-[rgba(14,165,233,.08)] hover:bg-[rgba(14,165,233,.18)] hover:text-sky-300 text-xs font-medium"
          onClick={onExportNotion}
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">Export Notion</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 sm:gap-2 text-fo-sub border-border hover:border-fo-indigo hover:text-fo-indigo text-xs"
          onClick={onExportPdf}
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
        <Button
          size="sm"
          className="gap-1.5 sm:gap-2 bg-fo-indigo text-white hover:opacity-85 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onRunAll}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={13} />
              <span>Run All</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
