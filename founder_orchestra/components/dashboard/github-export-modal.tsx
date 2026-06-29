/**
 * =============================================================================
 * COMPONENT — GitHub Export Modal
 * =============================================================================
 *
 * Modal dialog to configure GitHub PAT, repository credentials, and sync
 * engineering issues directly to GitHub.
 *
 * Owner: Shared / UI
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitBranch, Loader2, CheckCircle, ExternalLink, Key, FolderGit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GithubIssueItem } from "./github-issues";

interface GithubExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: GithubIssueItem[];
}

export function GithubExportModal({ open, onOpenChange, issues }: GithubExportModalProps) {
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ count: number; url: string } | null>(null);

  // Reset credentials and state to blank when modal opens
  useEffect(() => {
    if (open) {
      setToken("");
      setOwner("");
      setRepo("");
      setSuccessResult(null);
    }
  }, [open]);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !owner || !repo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all GitHub credentials.",
        variant: "destructive",
      });
      return;
    }

    // Cache credentials
    localStorage.setItem("fo_github_token", token.trim());
    localStorage.setItem("fo_github_owner", owner.trim());
    localStorage.setItem("fo_github_repo", repo.trim());

    setIsExporting(true);
    setSuccessResult(null);

    try {
      const res = await fetch("/api/github/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          owner: owner.trim(),
          repo: repo.trim(),
          issues,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to export issues");
      }

      setSuccessResult({
        count: data.createdCount,
        url: data.repoUrl,
      });

      toast({
        title: "Export Successful! 🎉",
        description: `Successfully published ${data.createdCount} issues to GitHub.`,
      });
    } catch (err: any) {
      toast({
        title: "Export Failed",
        description: err.message || "Something went wrong while exporting.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Helper validation for GitHub Personal Access Tokens and repo inputs
  const isValidToken = (t: string) => {
    const clean = t.trim();
    if (!clean) return false;
    return /^(ghp_|github_pat_|gho_|ghu_|ghs_|ghr_)[a-zA-Z0-9_]+$/.test(clean) || clean.length >= 20;
  };

  const isFormValid = isValidToken(token) && owner.trim().length > 0 && repo.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-[#0D121F] border-border text-fo-text">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-semibold flex items-center gap-2">
            <GitBranch size={18} className="text-fo-purple" />
            Sync Backlog to GitHub
          </DialogTitle>
          <DialogDescription className="text-xs text-fo-muted">
            Export all {issues.length} engineering issues directly to your real GitHub repository.
          </DialogDescription>
        </DialogHeader>

        {successResult ? (
          <div className="py-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,.15)] text-fo-emerald flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-sm font-semibold">Issues Created Successfully!</h3>
            <p className="text-xs text-fo-muted max-w-[320px]">
              Published {successResult.count} technical issues with priority badges and story points to{" "}
              <span className="text-fo-text font-semibold">{owner}/{repo}</span>.
            </p>

            <div className="flex gap-2.5 mt-3 w-full">
              <Button
                variant="outline"
                className="flex-1 text-xs border-border"
                onClick={() => setSuccessResult(null)}
              >
                Sync Again
              </Button>
              <Button
                className="flex-1 text-xs bg-fo-indigo hover:bg-indigo-500 text-white gap-1.5"
                onClick={() => window.open(successResult.url, "_blank")}
              >
                View on GitHub <ExternalLink size={13} />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleExport} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-fo-sub flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key size={13} className="text-fo-muted" /> Personal Access Token (PAT)
                </span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-fo-indigo hover:underline inline-flex items-center gap-1"
                >
                  Generate PAT <ExternalLink size={10} />
                </a>
              </label>
              <Input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="bg-[rgba(255,255,255,.03)] border-border text-xs font-mono"
                required
              />
              {token && !isValidToken(token) && (
                <p className="text-[11px] text-fo-rose mt-1">
                  Token format invalid. Classic PATs start with &apos;ghp_&apos; or Fine-grained with &apos;github_pat_&apos;.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-fo-sub flex items-center gap-1.5">
                  <FolderGit2 size={13} className="text-fo-muted" /> Repo Owner
                </label>
                <Input
                  placeholder="e.g. octocat"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="bg-[rgba(255,255,255,.03)] border-border text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-fo-sub">Repo Name</label>
                <Input
                  placeholder="e.g. my-app"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="bg-[rgba(255,255,255,.03)] border-border text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs border-border"
                onClick={() => onOpenChange(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-fo-purple hover:bg-purple-600 text-white gap-1.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isExporting || !isFormValid}
              >
                {isExporting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Publishing Issues...</span>
                  </>
                ) : (
                  <>
                    <GitBranch size={14} />
                    <span>Publish to GitHub</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
