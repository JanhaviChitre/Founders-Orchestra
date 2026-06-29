/**
 * =============================================================================
 * COMPONENT — GitHub Issues
 * =============================================================================
 *
 * Issue list matching engineeringManagerOutputSchema with GitHub export integration.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { GithubExportModal } from "./github-export-modal";

export interface GithubIssueItem {
  number: string;
  title: string;
  labels: string[];
  priority: "P1" | "P2" | "P3";
  story_points: number;
  epic: string;
}

interface GithubIssuesProps {
  github_issues?: GithubIssueItem[];
}

const PRIORITY_STYLES: Record<string, string> = {
  P1: "bg-[rgba(244,63,94,.15)] text-fo-rose border-0",
  P2: "bg-[rgba(245,158,11,.15)] text-fo-amber border-0",
  P3: "bg-[rgba(16,185,129,.15)] text-fo-emerald border-0",
};

export function GithubIssues({ github_issues }: GithubIssuesProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!github_issues || github_issues.length === 0) {
    return (
      <Card>
        <CardContent className="pt-5 pb-5 flex flex-col items-center justify-center min-h-[160px] text-center gap-2">
          <GitBranch size={18} className="text-fo-muted" />
          <p className="text-sm font-semibold text-fo-sub">GitHub Issues</p>
          <p className="text-xs text-fo-muted">Engineering agent did not return task data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-1">
            <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] flex items-center gap-2">
              <GitBranch size={14} />
              GitHub Engineering Backlog
              <span className="font-mono text-[11px] text-fo-muted font-normal">Sprint 1</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="text-xs border-[rgba(168,85,247,.3)] bg-[rgba(168,85,247,.08)] text-fo-purple hover:bg-[rgba(168,85,247,.18)] hover:text-purple-300 transition-colors gap-1.5 h-7 px-3 font-medium self-start sm:self-auto"
            >
              <GitBranch size={13} />
              <span>Sync to GitHub</span>
              <ExternalLink size={11} className="opacity-70" />
            </Button>
          </div>

          <p className="text-xs text-fo-muted mb-4">
            Actionable engineering tasks ready for assignment with priority tags and story points.
          </p>

          <div className="flex flex-col gap-1.5">
            {github_issues.map((issue, idx) => (
              <div
                key={`${issue.number || "issue"}-${idx}`}
                className="flex items-center gap-3 p-2.5 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] hover:border-[rgba(99,102,241,.3)] transition-colors"
              >
                <span className="font-mono text-[11px] text-fo-muted w-10 flex-shrink-0 font-semibold">
                  #{issue.number}
                </span>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-fo-emerald flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{issue.title}</div>
                  <div className="flex gap-1.5 mt-1 flex-wrap items-center">
                    {issue.priority && (
                      <Badge className={cn("text-[10px] font-semibold px-[7px] py-0 h-4 rounded-full", PRIORITY_STYLES[issue.priority])}>
                        {issue.priority}
                      </Badge>
                    )}
                    {(issue.labels || []).map((lbl, lIdx) => (
                      <Badge
                        key={`${lbl}-${lIdx}`}
                        className="text-[10px] font-semibold px-[7px] py-0 h-4 border-0 rounded-full bg-[rgba(99,102,241,.15)] text-fo-indigo"
                      >
                        {lbl}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[11px] text-fo-muted flex-shrink-0">{issue.story_points} sp</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <GithubExportModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        issues={github_issues}
      />
    </>
  );
}
