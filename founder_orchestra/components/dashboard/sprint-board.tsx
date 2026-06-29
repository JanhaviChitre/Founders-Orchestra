/**
 * =============================================================================
 * COMPONENT — Sprint Execution Roadmap
 * =============================================================================
 *
 * Renders 3 dynamic AI-named technical milestone phases with equal day durations.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Layers, Zap, CheckCircle2, ListTodo } from "lucide-react";

export interface SprintPhase {
  phase_number: number;
  name: string;
  duration_days: string;
  tasks: string[];
}

export interface SprintPlanData {
  duration_weeks: number;
  phases?: SprintPhase[];
  todo?: string[];
  in_progress?: string[];
  done?: string[];
}

interface SprintBoardProps {
  sprint_plan?: SprintPlanData;
}

const PHASE_THEMES = [
  {
    icon: Layers,
    colorClass: "text-fo-sky",
    borderClass: "border-[rgba(56,189,248,.2)]",
    headerBg: "bg-[rgba(56,189,248,.08)]",
    badgeBg: "bg-[rgba(56,189,248,.15)] text-fo-sky",
    defaultDays: "Sprint Days 1 – 4",
  },
  {
    icon: Zap,
    colorClass: "text-fo-purple",
    borderClass: "border-[rgba(168,85,247,.2)]",
    headerBg: "bg-[rgba(168,85,247,.08)]",
    badgeBg: "bg-[rgba(168,85,247,.15)] text-fo-purple",
    defaultDays: "Sprint Days 5 – 9",
  },
  {
    icon: CheckCircle2,
    colorClass: "text-fo-emerald",
    borderClass: "border-[rgba(16,185,129,.2)]",
    headerBg: "bg-[rgba(16,185,129,.08)]",
    badgeBg: "bg-[rgba(16,185,129,.15)] text-fo-emerald",
    defaultDays: "Sprint Days 10 – 14",
  },
];

export function SprintBoard({ sprint_plan }: SprintBoardProps) {
  if (!sprint_plan) {
    return (
      <Card>
        <CardContent className="pt-5 pb-5 flex flex-col items-center justify-center min-h-[160px] text-center gap-2">
          <Calendar size={18} className="text-fo-muted" />
          <p className="text-sm font-semibold text-fo-sub">Sprint Execution Roadmap</p>
          <p className="text-xs text-fo-muted">Engineering agent did not return sprint data.</p>
        </CardContent>
      </Card>
    );
  }

  // Build phases array from dynamic AI output or legacy fallback
  let displayPhases: Array<{
    phaseNumber: string;
    title: string;
    subtitle: string;
    theme: typeof PHASE_THEMES[0];
    items: string[];
  }> = [];

  if (sprint_plan.phases && sprint_plan.phases.length > 0) {
    displayPhases = sprint_plan.phases.slice(0, 3).map((p, idx) => {
      const theme = PHASE_THEMES[idx % PHASE_THEMES.length];
      const pNum = String(p.phase_number || idx + 1).padStart(2, "0");

      // Format clean duration string (e.g. if LLM returned "4" or "Days 1-4", format consistently)
      let subtitleStr = theme.defaultDays;
      if (p.duration_days && p.duration_days.length > 3 && p.duration_days.includes("-")) {
        subtitleStr = p.duration_days.toLowerCase().startsWith("sprint")
          ? p.duration_days
          : `Sprint ${p.duration_days.toLowerCase().startsWith("days") ? p.duration_days : `Days ${p.duration_days}`}`;
      }

      return {
        phaseNumber: pNum,
        title: p.name.startsWith("Phase") ? p.name : `Phase ${idx + 1}: ${p.name}`,
        subtitle: subtitleStr,
        theme,
        items: p.tasks || [],
      };
    });
  } else {
    // Fallback for legacy data format
    displayPhases = [
      {
        phaseNumber: "01",
        title: "Phase 1: Architecture & Foundation",
        subtitle: "Sprint Days 1 – 4",
        theme: PHASE_THEMES[0],
        items: sprint_plan.todo || [],
      },
      {
        phaseNumber: "02",
        title: "Phase 2: Core Engineering",
        subtitle: "Sprint Days 5 – 9",
        theme: PHASE_THEMES[1],
        items: sprint_plan.in_progress || [],
      },
      {
        phaseNumber: "03",
        title: "Phase 3: Integration & Release",
        subtitle: "Sprint Days 10 – 14",
        theme: PHASE_THEMES[2],
        items: sprint_plan.done || [],
      },
    ];
  }

  const totalTasks = displayPhases.reduce((acc, p) => acc + p.items.length, 0);

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        {/* Header Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[rgba(255,255,255,.06)]">
          <div>
            <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] flex items-center gap-2 mb-1">
              <Calendar size={15} className="text-fo-purple" />
              Sprint Execution Roadmap
            </div>
            <p className="text-xs text-fo-muted">
              Pre-kickoff technical implementation timeline across 3 AI-structured milestone phases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-[rgba(168,85,247,.12)] text-fo-purple border-0 text-xs px-2.5 py-1 font-mono">
              <ClockIcon /> {sprint_plan.duration_weeks || 2}-Week Technical Sprint
            </Badge>
            <Badge className="bg-[rgba(255,255,255,.06)] text-fo-text border-0 text-xs px-2.5 py-1 font-mono">
              {totalTasks} Total Tasks
            </Badge>
          </div>
        </div>

        {/* Phase Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {displayPhases.map((phase, idx) => {
            const IconComponent = phase.theme.icon;
            return (
              <div
                key={idx}
                className={`rounded-xl overflow-hidden border ${phase.theme.borderClass} bg-[rgba(255,255,255,.015)] flex flex-col`}
              >
                {/* Phase Header */}
                <div className={`${phase.theme.headerBg} px-3.5 py-3 border-b ${phase.theme.borderClass} flex items-center justify-between`}>
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className={`font-mono text-xs font-bold ${phase.theme.colorClass} flex-shrink-0`}>
                      {phase.phaseNumber}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-fo-text flex items-center gap-1.5 truncate">
                        <IconComponent size={13} className={`${phase.theme.colorClass} flex-shrink-0`} />
                        <span className="truncate">{phase.title}</span>
                      </h4>
                      <span className="text-[10px] text-fo-muted block font-mono mt-0.5">{phase.subtitle}</span>
                    </div>
                  </div>
                  <Badge className={`text-[10px] px-1.5 py-0.5 font-mono flex-shrink-0 ${phase.theme.badgeBg}`}>
                    {phase.items.length} tasks
                  </Badge>
                </div>

                {/* Task List */}
                <div className="p-2.5 space-y-2 flex-1">
                  {phase.items.length === 0 ? (
                    <div className="py-6 text-center text-xs text-fo-muted italic">
                      No tasks scheduled in this phase.
                    </div>
                  ) : (
                    phase.items.map((item, itemIdx) => (
                      <div
                        key={`${item}-${itemIdx}`}
                        className="p-2.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] hover:border-[rgba(255,255,255,.12)] transition-all flex items-start gap-2.5 text-[12px] text-fo-text font-medium leading-relaxed"
                      >
                        <ListTodo size={13} className="text-fo-muted flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{item}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
