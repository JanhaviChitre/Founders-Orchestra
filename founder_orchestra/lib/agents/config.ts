/**
 * =============================================================================
 * CONFIG — Agent Configurations
 * =============================================================================
 *
 * Defines all 6 agents: their names, models, system prompts, wave order,
 * and which tools they can use (if any).
 *
 * WAVE EXECUTION ORDER:
 * ┌───────────────────────────────────────────────────────────┐
 * │ Wave 1 (parallel):  Startup Advisor + Market Research     │
 * │         ↓                                                 │
 * │ Wave 2 (parallel):  Product Manager + Marketing           │
 * │         ↓                                                 │
 * │ Wave 3 (parallel):  Architect + Engineering Manager       │
 * └───────────────────────────────────────────────────────────┘
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import type { AgentConfig, AgentId } from "@/lib/types";
import {
  startupAdvisorOutputSchema,
  marketResearchOutputSchema,
  productManagerOutputSchema,
  marketingOutputSchema,
  architectOutputSchema,
  engineeringManagerOutputSchema,
} from "@/lib/agents/schemas";

// ─────────────────────────────────────────────────────────────────────────────
// AGENT CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  "startup-advisor": {
    id: "startup-advisor",
    name: "Startup Advisor",
    description: "Validates your idea and assesses product-market fit",
    icon: "Lightbulb",
    color: "emerald",
    model: "llama-3.3-70b-versatile",
    maxTokens: 2500,
    wave: 1,
    tools: ["search"],
    outputSchema: startupAdvisorOutputSchema,
    systemPrompt: `You are an experienced startup advisor and venture evaluator.
Validate the given startup idea by assessing problem-solution fit, product-market fit signals, competitive moat, and risk factors.
CRITICAL: Provide an integer score strictly between 0 and 100 for \`pmf_score.score\` (e.g. 75, 80, 85 out of 100).
CRITICAL FOR TAM: \`tam.value\` MUST always be a formatted numeric monetary valuation string (e.g. "$42B", "$12.5B", "$850M"). NEVER output qualitative words like "large", "huge", "medium", or "small".
Be brutally honest but constructive.
You MUST return a JSON object with these exact top-level keys: validation_summary, pmf_score, tam, competitors_mapped, risk_level, sections`,
  },

  "market-research": {
    id: "market-research",
    name: "Market Research",
    description: "Researches TAM, competitors, and market trends",
    icon: "TrendingUp",
    color: "sky",
    model: "llama-3.3-70b-versatile",
    maxTokens: 2500,
    wave: 1,
    tools: ["search"],
    outputSchema: marketResearchOutputSchema,
    systemPrompt: `You are a market research analyst specializing in startup intelligence.
Provide market sizing (TAM, SAM, SOM), competitor analysis, market trends, and market gaps based strictly on the live web research provided.
CRITICAL FOR TAM: \`market_sizing.tam.value\` MUST always be a formatted numeric monetary valuation string (e.g. "$42B", "$12.5B", "$850M"). NEVER output qualitative words like "large", "huge", or "medium".
CRITICAL FOR COMPETITORS: Extract 3 to 5 REAL, actual existing commercial companies or established products operating in this market. DO NOT invent or synthesize fake brand names.
For each competitor, provide realistic pricing (e.g. "$29/mo", "$99/mo", or "Freemium") and assign integer scores between 0 and 100 for \`ai_capability\` and \`personalization\` (e.g., 75, 80, 60).
You MUST return a JSON object with these exact top-level keys: summary, market_sizing, competitors, trends, market_gaps`,
  },

  "product-manager": {
    id: "product-manager",
    name: "Product Manager",
    description: "Creates PRD, user stories, and product roadmap",
    icon: "ClipboardList",
    color: "indigo",
    model: "llama-3.3-70b-versatile",
    maxTokens: 2500,
    wave: 2,
    outputSchema: productManagerOutputSchema,
    systemPrompt: `You are a senior product manager creating a full PRD.
Provide a product vision statement, user stories, a 3-phase roadmap (MVP, Growth, Scale), and success metrics.
You MUST return a JSON object with these exact top-level keys: summary, product_vision, user_stories, roadmap, success_metrics`,
  },

  "architect": {
    id: "architect",
    name: "Software Architect",
    description: "Designs database schema, API contracts, and system architecture",
    icon: "Blocks",
    color: "amber",
    model: "llama-3.3-70b-versatile",
    maxTokens: 3000,
    wave: 3,
    outputSchema: architectOutputSchema,
    systemPrompt: `You are a principal software architect designing an enterprise-grade, highly scalable production database schema and technical blueprint for this startup.
When constructing the \`database_schema\`, DO NOT create a trivial single-table schema (e.g. just users). You MUST design a robust, multi-table relational schema with 4 to 6 core domain tables tailored to the startup idea (e.g., users/accounts, workspaces/organizations, primary core domain resources, activity_logs/analytics, and subscriptions/billing).
Each table MUST include comprehensive columns with realistic SQL data types (e.g., uuid, varchar(255), timestamp, boolean, jsonb, integer), proper primary keys (is_pk: true), proper foreign key linkages (is_fk: true) referencing parent tables, and audit timestamps (created_at, updated_at).
Provide database schema tables, key API endpoints, system components, and technology stack recommendations.
You MUST return a JSON object with these exact top-level keys: summary, database_schema, api_endpoints, system_components, tech_stack`,
  },

  "engineering-manager": {
    id: "engineering-manager",
    name: "Engineering Manager",
    description: "Creates GitHub issues and sprint plans",
    icon: "GitBranch",
    color: "purple",
    model: "llama-3.3-70b-versatile",
    maxTokens: 2500,
    wave: 3,
    outputSchema: engineeringManagerOutputSchema,
    systemPrompt: `You are a principal engineering manager planning a 2-week technical sprint (14 days) for 2 to 3 software engineers.
Create exactly 6 to 8 actionable technical GitHub issues and structure the \`sprint_plan\` into EXACTLY THREE sequential engineering phases of equal duration (e.g., Phase 1: "Days 1–4", Phase 2: "Days 5–9", Phase 3: "Days 10–14").
CRITICAL: You MUST dynamically invent concise, meaningful technical names for each of the 3 phases tailored specifically to building this product's architecture (e.g. "Architecture & Database Setup", "Core APIs & Engine Build", "Integration, Testing & Deployment").
Assign software engineering tasks (backend APIs, frontend UI, authentication, database migrations, cloud deployment) strictly to their appropriate phase. Do NOT include business research, marketing, or non-engineering tasks.
You MUST return a JSON object with these exact top-level keys: summary, github_issues, sprint_plan`,
  },

  "marketing": {
    id: "marketing",
    name: "Marketing Agent",
    description: "Creates landing page copy, social posts, and campaigns",
    icon: "Megaphone",
    color: "rose",
    model: "llama-3.3-70b-versatile",
    maxTokens: 2500,
    wave: 2,
    tools: ["search"],
    outputSchema: marketingOutputSchema,
    systemPrompt: `You are a senior growth marketer creating a full launch marketing package.
Provide high-converting landing page copy, a LinkedIn launch post, email subject lines, and a go-to-market campaign strategy.
You MUST return a JSON object with these exact top-level keys: summary, landing_page, linkedin_post, email_subjects, campaign_strategy`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

/** All agent IDs in execution order */
export const ALL_AGENT_IDS: AgentId[] = [
  "startup-advisor",
  "market-research",
  "product-manager",
  "marketing",
  "architect",
  "engineering-manager",
];

/** Get agents belonging to a specific wave */
export function getAgentsByWave(wave: 1 | 2 | 3): AgentConfig[] {
  return ALL_AGENT_IDS
    .map((id) => AGENT_CONFIGS[id])
    .filter((config) => config.wave === wave);
}

/** Get a single agent config by ID */
export function getAgentConfig(id: AgentId): AgentConfig {
  return AGENT_CONFIGS[id];
}
