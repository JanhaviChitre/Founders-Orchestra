/**
 * =============================================================================
 * COMPONENT — Competitor Table
 * =============================================================================
 *
 * Competitive landscape table matching marketResearchOutputSchema.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CompetitorItem {
  name: string;
  tag: string;
  strengths: string;
  weaknesses: string;
  price_per_month: string;
  threat_level: "low" | "medium" | "high";
  scores: { ai_capability: number; personalization: number };
}

interface CompetitorTableProps {
  competitors?: CompetitorItem[];
}

const DEFAULT_COMPETITORS: CompetitorItem[] = [
  { name: "Whoop", tag: "Recovery Wearable", strengths: "Strain tracking", weaknesses: "No workout generator", price_per_month: "$30", threat_level: "high", scores: { ai_capability: 75, personalization: 80 } },
  { name: "Fitbod", tag: "Workout Generator", strengths: "Gym tracking", weaknesses: "Generic recommendations", price_per_month: "$13", threat_level: "medium", scores: { ai_capability: 60, personalization: 65 } },
];

const THREAT_STYLES = {
  high: "bg-[rgba(244,63,94,.15)] text-fo-rose border-0",
  medium: "bg-[rgba(245,158,11,.15)] text-fo-amber border-0",
  low: "bg-[rgba(16,185,129,.15)] text-fo-emerald border-0",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
} as const;

const MotionTableBody = motion.create(TableBody);
const MotionTableRow = motion.create(TableRow);

export function CompetitorTable({ competitors = DEFAULT_COMPETITORS }: CompetitorTableProps) {
  const list = competitors && competitors.length > 0 ? competitors : DEFAULT_COMPETITORS;

  return (
    <Card className="mb-7">
      <CardContent className="pt-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-1">
          Competitive Intelligence Matrix
        </div>
        <p className="text-xs text-fo-muted mb-4">
          Feature capability scoring, pricing models, and market threat levels of real competitors.
        </p>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Company</TableHead>
                <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">AI Capability</TableHead>
                <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Personalization</TableHead>
                <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Price/mo</TableHead>
                <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Threat Level</TableHead>
              </TableRow>
            </TableHeader>
            <MotionTableBody variants={containerVariants} initial="hidden" animate="show">
              {list.map((comp) => (
                <MotionTableRow
                  key={comp.name}
                  variants={rowVariants}
                  className="border-[rgba(255,255,255,.04)] hover:bg-[rgba(255,255,255,.02)]"
                >
                  <TableCell>
                    <span className="font-semibold text-[13px]">{comp.name}</span>
                    <span className="block text-[11px] text-fo-sub">{comp.tag}</span>
                  </TableCell>
                  <TableCell>
                    <ScoreBar score={comp.scores?.ai_capability ?? 50} />
                  </TableCell>
                  <TableCell>
                    <ScoreBar score={comp.scores?.personalization ?? 50} />
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{comp.price_per_month}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-[11px] font-semibold px-2 py-0.5 capitalize", THREAT_STYLES[comp.threat_level || "low"])}>
                      {comp.threat_level || "low"}
                    </Badge>
                  </TableCell>
                </MotionTableRow>
              ))}
            </MotionTableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ score }: { score: number }) {
  const normalizedScore = score > 0 && score <= 10 ? score * 10 : score;
  const clampedPercentage = Math.min(Math.max(normalizedScore, 0), 100);

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-[70px] bg-[rgba(255,255,255,.06)] rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      <span className="font-mono text-xs text-fo-sub font-semibold">{score}</span>
    </div>
  );
}
