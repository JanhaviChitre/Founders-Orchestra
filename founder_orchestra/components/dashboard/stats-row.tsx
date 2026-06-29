/**
 * =============================================================================
 * COMPONENT — Stats Row
 * =============================================================================
 *
 * 4-column grid of key metric stat cards reading directly from discrete schemas.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import type { StartupAdvisorOutput, MarketResearchOutput, EngineeringManagerOutput } from "@/lib/agents/schemas";

interface StatCardData {
  eyebrow: string;
  value: string;
  subtitle: string;
  delta: string;
  color: string;
  accentClass: string;
  isLoading: boolean;
}

export function StatsRow() {
  const agents = useProjectStore((s) => s.agents) || {};

  const advisorOutput = agents["startup-advisor"] as StartupAdvisorOutput | undefined;
  const marketOutput = agents["market-research"] as MarketResearchOutput | undefined;
  const engOutput = agents["engineering-manager"] as EngineeringManagerOutput | undefined;

  const rawTam = advisorOutput?.tam?.value || marketOutput?.market_sizing?.tam?.value;
  const tam = rawTam && !/^(large|huge|medium|small|massive|substantial|growing)$/i.test(rawTam.trim())
    ? rawTam
    : (marketOutput?.market_sizing?.tam?.value && !/^(large|huge|medium|small|massive|substantial|growing)$/i.test(marketOutput.market_sizing.tam.value.trim())
        ? marketOutput.market_sizing.tam.value
        : undefined);
  const competitors = advisorOutput?.competitors_mapped?.count !== undefined
    ? String(advisorOutput.competitors_mapped.count)
    : marketOutput?.competitors?.length !== undefined
    ? String(marketOutput.competitors.length)
    : undefined;
  const pmfScore = advisorOutput?.pmf_score?.score !== undefined
    ? `${advisorOutput.pmf_score.score > 0 && advisorOutput.pmf_score.score <= 10 ? advisorOutput.pmf_score.score * 10 : advisorOutput.pmf_score.score}/100`
    : undefined;
  const artifacts = engOutput?.github_issues?.length !== undefined
    ? String(engOutput.github_issues.length)
    : undefined;

  const overallStatus = useProjectStore((s) => s.overallStatus);
  const hasRun = overallStatus !== "not-started";

  const marketStatus = getAgentStatus(agents, "market-research");
  const advisorStatus = getAgentStatus(agents, "startup-advisor");
  const engStatus = getAgentStatus(agents, "engineering-manager");

  const isMarketLoading = !hasRun || marketStatus !== "completed";
  const isAdvisorLoading = !hasRun || advisorStatus !== "completed";
  const isEngLoading = !hasRun || engStatus !== "completed";

  const stats: StatCardData[] = [
    {
      eyebrow: "Total Addressable Market",
      value: tam ?? "",
      subtitle: advisorOutput?.tam?.description || marketOutput?.market_sizing?.insight || "TAM market sizing",
      delta: advisorOutput?.tam?.growth_rate ? `↑ ${advisorOutput.tam.growth_rate} growth` : "↑ Strong growth",
      color: "#6366F1",
      accentClass: "text-fo-indigo",
      isLoading: isMarketLoading && isAdvisorLoading,
    },
    {
      eyebrow: "Competitors Mapped",
      value: competitors ?? "",
      subtitle: "Direct + indirect competitors",
      delta: advisorOutput?.risk_level ? `Risk level: ${advisorOutput.risk_level}` : "↑ Gaps identified",
      color: "#10B981",
      accentClass: "text-fo-emerald",
      isLoading: isMarketLoading && isAdvisorLoading,
    },
    {
      eyebrow: "PMF Score",
      value: pmfScore ?? "",
      subtitle: advisorOutput?.pmf_score?.label || "Demand & competition signals",
      delta: advisorOutput?.pmf_score?.signal ? `Signal: ${advisorOutput.pmf_score.signal}` : "↑ Strong signal",
      color: "#F59E0B",
      accentClass: "text-fo-amber",
      isLoading: isAdvisorLoading,
    },
    {
      eyebrow: "Artifacts Generated",
      value: artifacts ?? "",
      subtitle: "GitHub Issues generated",
      delta: engOutput?.sprint_plan?.duration_weeks ? `${engOutput.sprint_plan.duration_weeks}w sprint plan` : "↑ Sprint planned",
      color: "#38BDF8",
      accentClass: "text-fo-sky",
      isLoading: isEngLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
      {stats.map((stat) => (
        <motion.div
          key={stat.eyebrow}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full rounded-xl overflow-hidden"
        >
          <Card className="h-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: stat.color }}
            />
            <CardContent className="pt-4 pb-4 px-4 flex flex-col justify-between h-full min-h-[110px]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.6px] text-fo-muted">
                {stat.eyebrow}
              </div>

              <div className="my-1.5 min-h-[36px] flex items-center">
                <AnimatePresence mode="wait">
                  {stat.isLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                      className={`font-mono text-2xl font-bold tracking-tight ${stat.accentClass}`}
                    >
                      {stat.value}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div className="text-[11px] text-fo-sub truncate">
                  {stat.subtitle}
                </div>
                <div className="text-[10px] font-medium text-fo-muted mt-0.5">
                  {stat.delta}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
