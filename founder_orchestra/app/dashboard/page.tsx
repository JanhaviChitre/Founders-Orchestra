/**
 * =============================================================================
 * PAGE — Dashboard
 * =============================================================================
 *
 * The main Intelligence Dashboard — displaying discrete AI agent outputs
 * directly in components with zero text/regex parsing.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useEffect } from "react";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentStatus } from "@/lib/types";
import type {
  MarketResearchOutput,
  ProductManagerOutput,
  ArchitectOutput,
  EngineeringManagerOutput,
  MarketingOutput,
} from "@/lib/agents/schemas";

// Dashboard sections
import { AgentOrbit } from "@/components/dashboard/agent-orbit";
import { StatsRow } from "@/components/dashboard/stats-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { MarketSizing } from "@/components/dashboard/market-sizing";
import { TrendList } from "@/components/dashboard/trend-list";
import { CompetitorTable } from "@/components/dashboard/competitor-table";
import { UserStories } from "@/components/dashboard/user-stories";
import { ProductRoadmap } from "@/components/dashboard/product-roadmap";
import { SchemaGrid } from "@/components/dashboard/schema-grid";
import { GithubIssues } from "@/components/dashboard/github-issues";
import { SprintBoard } from "@/components/dashboard/sprint-board";
import { MarketingAssets } from "@/components/dashboard/marketing-assets";

// Loading skeletons
import {
  MarketSizingSkeleton,
  TrendListSkeleton,
  CompetitorTableSkeleton,
  UserStoriesSkeleton,
  ProductRoadmapSkeleton,
  SchemaGridSkeleton,
  GithubIssuesSkeleton,
  SprintBoardSkeleton,
  MarketingAssetsSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

// Helper to determine badge/suffix based on agent status
function getHeaderStatusProps(status: AgentStatus) {
  switch (status) {
    case "running":
      return {
        badge: "⚡ Generating…",
        badgeColor: "#F59E0B",
        suffix: undefined,
      };
    case "idle":
      return {
        badge: undefined,
        badgeColor: undefined,
        suffix: "(queued)",
      };
    case "error":
      return {
        badge: "⚠️ Error",
        badgeColor: "#F43F5E",
        suffix: undefined,
      };
    case "completed":
    default:
      return {
        badge: undefined,
        badgeColor: undefined,
        suffix: undefined,
      };
  }
}

export default function DashboardPage() {
  const agents = useProjectStore((s) => s.agents) || {};
  const overallStatus = useProjectStore((s) => s.overallStatus);

  // Whether the pipeline has ever been run — gates all content sections
  const hasRun = overallStatus !== "not-started";

  // Retrieve statuses of the corresponding agents
  const marketStatus = getAgentStatus(agents, "market-research");
  const pmStatus = getAgentStatus(agents, "product-manager");
  const architectStatus = getAgentStatus(agents, "architect");
  const engStatus = getAgentStatus(agents, "engineering-manager");
  const marketingStatus = getAgentStatus(agents, "marketing");

  // Retrieve outputs casted to discrete schema types
  const marketOutput = agents["market-research"] as MarketResearchOutput | undefined;
  const pmOutput = agents["product-manager"] as ProductManagerOutput | undefined;
  const architectOutput = agents["architect"] as ArchitectOutput | undefined;
  const engOutput = agents["engineering-manager"] as EngineeringManagerOutput | undefined;
  const marketingOutput = agents["marketing"] as MarketingOutput | undefined;

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const visibleSections = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting);
        });

        const order = ["orbit", "market", "competitors", "product", "marketing", "architecture", "engineering"];
        const currentActive = order.find((id) => visibleSections.get(id));

        if (currentActive) {
          useProjectStore.getState().setActiveSection(currentActive);
        }
      },
      {
        rootMargin: "-10% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* ── Agent Orbit ────────────────────────────────────────────────────── */}
      <section id="orbit">
        <AgentOrbit />
        <StatsRow />
      </section>

      {/* ── Market Research Section ───────────────────────────────────────── */}
      <section id="market" className="mb-10">
        <SectionHeader
          title="Market Intelligence"
          description="Quantitative TAM/SAM/SOM market valuation estimates and live industry tailwind trends."
          color="#38BDF8"
          {...getHeaderStatusProps(marketStatus)}
        />
        {!hasRun || marketStatus !== "completed" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <MarketSizingSkeleton />
            </div>
            <div>
              <TrendListSkeleton />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="market-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-5"
            >
              <div className="lg:col-span-2">
                <MarketSizing market_sizing={marketOutput?.market_sizing} />
              </div>
              <div>
                <TrendList trends={marketOutput?.trends} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Competitive Landscape Section ───────────────────────────────────── */}
      <section id="competitors" className="mb-10">
        <SectionHeader
          title="Competitive Landscape"
          description="Direct and indirect competitor benchmarking, feature capability matrix, and pricing analysis."
          color="#38BDF8"
          {...getHeaderStatusProps(marketStatus)}
        />
        {!hasRun || marketStatus !== "completed" ? (
          <CompetitorTableSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="competitors-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CompetitorTable competitors={marketOutput?.competitors} />
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Product Intelligence Section ─────────────────────────────────── */}
      <section id="product" className="mb-10">
        <SectionHeader
          title="Product Blueprint & Roadmap"
          description="Prioritized user stories, core requirements, and strategic multi-phase product release roadmap."
          color="#6366F1"
          {...getHeaderStatusProps(pmStatus)}
        />
        {!hasRun || pmStatus !== "completed" ? (
          <div className="space-y-7">
            <UserStoriesSkeleton />
            <ProductRoadmapSkeleton />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="product-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-7"
            >
              <UserStories user_stories={pmOutput?.user_stories} />
              <ProductRoadmap roadmap={pmOutput?.roadmap} />
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Marketing Section ──────────────────────────────────────────────── */}
      <section id="marketing" className="mb-10">
        <SectionHeader
          title="Marketing Assets & Strategy"
          description="High-converting landing page copy, social launch posts, email angles, and positioning strategy."
          color="#F43F5E"
          {...getHeaderStatusProps(marketingStatus)}
        />
        {!hasRun || marketingStatus !== "completed" ? (
          <MarketingAssetsSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="marketing-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MarketingAssets
                landing_page={marketingOutput?.landing_page}
                linkedin_post={marketingOutput?.linkedin_post}
                email_subjects={marketingOutput?.email_subjects}
                campaign_strategy={marketingOutput?.campaign_strategy}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Architecture Section ──────────────────────────────────────────── */}
      <section id="architecture" className="mb-10">
        <SectionHeader
          title="System Architecture"
          description="Scalable relational database schema design, entity relationships, primary/foreign keys, and SQL types."
          color="#F59E0B"
          {...getHeaderStatusProps(architectStatus)}
        />
        {!hasRun || architectStatus !== "completed" ? (
          <SchemaGridSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="architecture-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SchemaGrid database_schema={architectOutput?.database_schema} />
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Engineering Section ──────────────────────────────────────────── */}
      <section id="engineering" className="mb-10">
        <SectionHeader
          title="Engineering & Sprint Plan"
          description="Actionable engineering backlog, GitHub issue tracking, and pre-kickoff 3-phase technical roadmap."
          color="#A855F7"
          {...getHeaderStatusProps(engStatus)}
        />
        {!hasRun || engStatus !== "completed" ? (
          <div className="space-y-7">
            <GithubIssuesSkeleton />
            <SprintBoardSkeleton />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="engineering-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-7"
            >
              <GithubIssues github_issues={engOutput?.github_issues} />
              <SprintBoard sprint_plan={engOutput?.sprint_plan} />
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}
