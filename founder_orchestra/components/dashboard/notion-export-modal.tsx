/**
 * =============================================================================
 * COMPONENT — Notion Export Modal
 * =============================================================================
 *
 * Modal dialog to configure Notion Integration Secret, Parent Page ID,
 * and deploy a live Notion Startup Operating System workspace.
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
import { Loader2, CheckCircle, ExternalLink, Key, FileText, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProjectStore } from "@/lib/store/project-store";

interface NotionExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotionExportModal({ open, onOpenChange }: NotionExportModalProps) {
  const projectId = useProjectStore((s) => s.projectId);
  const [apiKey, setApiKey] = useState("");
  const [parentPageId, setParentPageId] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  // Reset credentials and state to blank when modal opens
  useEffect(() => {
    if (open) {
      setApiKey("");
      setParentPageId("");
      setSuccessUrl(null);
    }
  }, [open]);

  const isKeyValid = apiKey.trim().startsWith("secret_") || apiKey.trim().length >= 30;
  const isPageValid = parentPageId.trim().length > 0;
  const isFormValid = isKeyValid && isPageValid;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      toast({
        title: "No Active Project",
        description: "Please run the AI pipeline before deploying to Notion.",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid) return;

    // Cache credentials
    localStorage.setItem("fo_notion_key", apiKey.trim());
    localStorage.setItem("fo_notion_page_id", parentPageId.trim());

    setIsExporting(true);
    setSuccessUrl(null);

    try {
      const res = await fetch("/api/notion/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          parentPageId: parentPageId.trim(),
          projectId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deploy Notion workspace");
      }

      setSuccessUrl(data.workspaceUrl);

      toast({
        title: "Deployment Successful! 🚀",
        description: "Your live Notion Startup OS workspace has been created.",
      });
    } catch (err: any) {
      toast({
        title: "Deployment Failed",
        description: err.message || "Something went wrong while exporting to Notion.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#0D121F] border-border text-fo-text">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-semibold flex items-center gap-2">
            <Sparkles size={18} className="text-fo-sky" />
            Deploy Live Notion Startup OS
          </DialogTitle>
          <DialogDescription className="text-xs text-fo-muted">
            Deploys a multi-database Notion workspace with competitor matrices, PRD modules, and sprint Kanban boards.
          </DialogDescription>
        </DialogHeader>

        {successUrl ? (
          <div className="py-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(14,165,233,.15)] text-fo-sky flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-sm font-semibold">Notion Workspace Deployed!</h3>
            <p className="text-xs text-fo-muted max-w-[340px]">
              Created live relational databases, user story documents, SQL schema blocks, and sprint roadmaps inside your Notion account.
            </p>

            <div className="flex gap-2.5 mt-3 w-full">
              <Button
                variant="outline"
                className="flex-1 text-xs border-border"
                onClick={() => setSuccessUrl(null)}
              >
                Deploy Again
              </Button>
              <Button
                className="flex-1 text-xs bg-fo-sky hover:bg-sky-500 text-white gap-1.5"
                onClick={() => window.open(successUrl, "_blank")}
              >
                Open in Notion <ExternalLink size={13} />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleExport} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-fo-sub flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key size={13} className="text-fo-muted" /> Notion Integration Token
                </span>
                <a
                  href="https://www.notion.so/my-integrations"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-fo-sky hover:underline inline-flex items-center gap-1"
                >
                  Create Integration Token <ExternalLink size={10} />
                </a>
              </label>
              <Input
                type="password"
                placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-[rgba(255,255,255,.03)] border-border text-xs font-mono"
                required
              />
              {apiKey && !isKeyValid && (
                <p className="text-[11px] text-fo-rose mt-1">
                  Integration token must start with &apos;secret_&apos;.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-fo-sub flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText size={13} className="text-fo-muted" /> Target Parent Page URL or ID
                </span>
              </label>
              <Input
                placeholder="https://notion.so/myworkspace/My-Page-1a2b3c4d..."
                value={parentPageId}
                onChange={(e) => setParentPageId(e.target.value)}
                className="bg-[rgba(255,255,255,.03)] border-border text-xs font-mono"
                required
              />
              <p className="text-[11px] text-fo-muted mt-1">
                Make sure to share your target page with your Notion integration!
              </p>
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
                className="text-xs bg-fo-sky hover:bg-sky-500 text-white gap-1.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isExporting || !isFormValid}
              >
                {isExporting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deploying Workspace...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Deploy Notion Workspace</span>
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
