/**
 * =============================================================================
 * COMPONENT — Marketing Assets
 * =============================================================================
 *
 * Landing page copy and LinkedIn post matching marketingOutputSchema.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Briefcase, Mail, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExpandableText } from "@/components/ui/expandable-text";

export interface MarketingAssetsProps {
  landing_page?: {
    headline: string;
    subheadline: string;
    cta: string;
    social_proof: string;
  };
  linkedin_post?: {
    content: string;
    hashtags: string[];
  };
  email_subjects?: Array<{
    angle: "curiosity" | "urgency" | "benefit";
    subject: string;
  }>;
  campaign_strategy?: {
    positioning: string;
    key_message: string;
    channels: string[];
  };
}

export function MarketingAssets({
  landing_page,
  linkedin_post,
  email_subjects,
  campaign_strategy,
}: MarketingAssetsProps) {
  if (!landing_page && !linkedin_post) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        <div className="rounded-xl border border-border bg-fo-surface p-6 flex flex-col items-center justify-center min-h-[160px] text-center gap-2">
          <Globe size={18} className="text-fo-muted" />
          <p className="text-sm font-semibold text-fo-sub">Landing Page Copy</p>
          <p className="text-xs text-fo-muted">Marketing agent did not return landing copy data.</p>
        </div>
        <div className="rounded-xl border border-border bg-fo-surface p-6 flex flex-col items-center justify-center min-h-[160px] text-center gap-2">
          <Briefcase size={18} className="text-fo-muted" />
          <p className="text-sm font-semibold text-fo-sub">LinkedIn Post Draft</p>
          <p className="text-xs text-fo-muted">Marketing agent did not return a social post.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Landing Page */}
        <Card>
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div>
              <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
                <Globe size={14} />
                Landing Page Copy
              </div>

              <div className="p-4 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-fo-indigo mb-2">
                  Hero — Above the Fold
                </div>
                <div className="font-display text-[17px] font-bold leading-snug mb-1.5">
                  {landing_page?.headline}
                </div>
                <div className="text-[13px] text-fo-sub leading-relaxed">
                  {landing_page?.subheadline}
                </div>
              </div>

              {landing_page?.social_proof && (
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] text-xs text-fo-sub italic">
                  &ldquo;{landing_page.social_proof}&rdquo;
                </div>
              )}
            </div>

            {landing_page?.cta && (
              <div className="pt-3">
                <Button className="w-full font-semibold text-xs py-2 h-auto bg-indigo-600 hover:bg-indigo-500 text-white">
                  {landing_page.cta}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LinkedIn Post */}
        <Card>
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div>
              <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
                <Briefcase size={14} />
                LinkedIn Launch Post
              </div>

              <div className="p-4 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]">
                <ExpandableText
                  text={linkedin_post?.content || ""}
                  maxChars={180}
                  textClassName="whitespace-pre-line text-xs leading-relaxed text-fo-text"
                />
              </div>

              {linkedin_post?.hashtags && linkedin_post.hashtags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-3">
                  {linkedin_post.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] text-fo-sky font-mono font-semibold">
                      #{tag.replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Strategy & Email Subjects */}
      {(email_subjects || campaign_strategy) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {email_subjects && email_subjects.length > 0 && (
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
                  <Mail size={14} />
                  Email Subject Lines
                </div>
                <div className="flex flex-col gap-2">
                  {email_subjects.map((email, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] text-xs">
                      <span className="font-medium">{email.subject}</span>
                      <Badge className="text-[10px] uppercase px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border-0">
                        {email.angle}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {campaign_strategy && (
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
                  <Target size={14} />
                  Campaign Strategy
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]">
                    <span className="font-semibold text-fo-indigo block mb-1">Positioning:</span>
                    <ExpandableText
                      text={campaign_strategy.positioning}
                      maxChars={120}
                      textClassName="text-xs text-fo-text leading-relaxed"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]">
                    <span className="font-semibold text-fo-indigo block mb-1">Key Message:</span>
                    <ExpandableText
                      text={campaign_strategy.key_message}
                      maxChars={120}
                      textClassName="text-xs text-fo-text leading-relaxed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
