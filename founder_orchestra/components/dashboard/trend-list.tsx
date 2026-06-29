/**
 * =============================================================================
 * COMPONENT — Trend List
 * =============================================================================
 *
 * Vertical list of emerging market trends matching marketResearchOutputSchema.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpandableText } from "@/components/ui/expandable-text";

export interface TrendItemData {
  name: string;
  description: string;
  momentum: string;
  direction: "up" | "down";
  growth_percent: number;
}

interface TrendListProps {
  trends?: TrendItemData[];
}

const DEFAULT_TRENDS: TrendItemData[] = [
  { name: "AI Personalization in Health", description: "Real-time adaptive workout plans", momentum: "+187%", direction: "up", growth_percent: 187 },
  { name: "Micro-workout Content", description: "<15 min sessions for time-poor users", momentum: "+211%", direction: "up", growth_percent: 211 },
];

export function TrendList({ trends = DEFAULT_TRENDS }: TrendListProps) {
  const list = trends && trends.length > 0 ? trends : DEFAULT_TRENDS;

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-1 flex items-center gap-2">
          <TrendingUp size={14} />
          Emerging Industry Trends
        </div>
        <p className="text-xs text-fo-muted mb-4">
          Key technology tailwinds and market momentum accelerating adoption.
        </p>

        <div className="flex flex-col gap-2.5">
          {list.map((trend, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2.5 px-3 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]"
            >
              <span className="font-mono text-[11px] text-fo-muted w-[18px]">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div className="flex-1">
                <div className="text-[13px] font-medium">{trend.name}</div>
                <div className="mt-0.5">
                  <ExpandableText
                    text={trend.description}
                    maxChars={60}
                    textClassName="text-[11px] text-fo-sub"
                  />
                </div>
              </div>

              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  trend.direction === "up" ? "text-fo-emerald" : "text-fo-rose"
                )}
              >
                {trend.momentum}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
