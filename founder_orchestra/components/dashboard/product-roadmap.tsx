/**
 * =============================================================================
 * COMPONENT — Product Roadmap
 * =============================================================================
 *
 * 3-phase product roadmap matching productManagerOutputSchema.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface RoadmapItem {
  phase: "MVP" | "Growth" | "Scale";
  label: string;
  quarter: "q1" | "q2" | "q3";
  features: string[];
}

interface ProductRoadmapProps {
  roadmap?: RoadmapItem[];
}

const QUARTER_STYLES = {
  q1: { bg: "bg-[rgba(99,102,241,.07)]", border: "border-[rgba(99,102,241,.25)]", label: "text-fo-indigo" },
  q2: { bg: "bg-[rgba(56,189,248,.07)]", border: "border-[rgba(56,189,248,.25)]", label: "text-fo-sky" },
  q3: { bg: "bg-[rgba(16,185,129,.07)]", border: "border-[rgba(16,185,129,.25)]", label: "text-fo-emerald" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 160, damping: 18 },
  },
} as const;

export function ProductRoadmap({ roadmap }: ProductRoadmapProps) {
  if (!roadmap || roadmap.length === 0) {
    return (
      <Card>
        <CardContent className="pt-5 pb-5 flex flex-col items-center justify-center min-h-[160px] text-center gap-2">
          <Map size={18} className="text-fo-muted" />
          <p className="text-sm font-semibold text-fo-sub">Product Roadmap</p>
          <p className="text-xs text-fo-muted">Product agent did not return roadmap data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-1 flex items-center gap-2">
          <Map size={14} />
          Multi-Phase Product Roadmap
        </div>
        <p className="text-xs text-fo-muted mb-4">
          Strategic feature rollout timeline planned across MVP, Growth, and Scale milestones.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {roadmap.map((item, idx) => {
            const style = QUARTER_STYLES[item.quarter] || QUARTER_STYLES.q3;
            return (
              <motion.div
                key={`${item.label}-${idx}`}
                variants={columnVariants}
                whileHover={{ y: -3, scale: 1.015 }}
                transition={{ y: { duration: 0.15 }, scale: { duration: 0.15 } }}
                className={cn("rounded-[10px] p-3.5 border cursor-default", style.bg, style.border)}
              >
                <div className={cn("font-mono text-[10px] font-semibold uppercase tracking-[1px] mb-2", style.label)}>
                  {item.phase} — {item.quarter.toUpperCase()}
                </div>
                <div className="font-display text-sm font-semibold mb-2">{item.label}</div>
                <ul className="space-y-1">
                  {(item.features || []).map((feat, featIdx) => (
                    <li key={`${feat}-${featIdx}`} className="text-xs text-fo-sub flex items-center gap-1.5">
                      <span className="text-[10px] text-fo-muted">—</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
