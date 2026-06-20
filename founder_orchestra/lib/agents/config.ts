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
    maxTokens: 1500,
    wave: 1,
    tools: ["search"],  // Can web-search for similar startups, market validation
    systemPrompt: `You are an experienced startup advisor and venture evaluator.
Validate the given startup idea by assessing:
1. Problem-Solution Fit — Is this solving a real problem?
2. Product-Market Fit signals — Is there real demand?
3. Competitive moat — What is the defensibility?
4. Risk factors — What could go wrong?
Search the web for recent similar startups, funding rounds, and market signals.
Be brutally honest but constructive. Give specific, actionable next steps.
Only output sections related to startup validation and advisor next steps. Do NOT summarize or repeat general market sizing or PRD details. Be highly concise.`,
  },

  "market-research": {
    id: "market-research",
    name: "Market Research",
    description: "Researches TAM, competitors, and market trends",
    icon: "TrendingUp",
    color: "sky",
    model: "llama-3.3-70b-versatile",
    maxTokens: 1500,
    wave: 1,
    tools: ["search"],  // Can web-search for TAM data, competitor info
    systemPrompt: `You are a market research analyst specializing in startup intelligence.
You will receive a startup idea and the startup advisor's validation output.
Using both, research and provide:
1. Market Sizing — TAM, SAM, SOM with real dollar figures.
2. Competitor Analysis — Direct and indirect competitors with their weaknesses.
3. Trend Analysis — 4 to 5 emerging trends with growth momentum.
4. Market Gaps — Underserved segments the startup can target.
Search the web for the latest industry reports, competitor data, and market estimates.
Use real numbers. Cite sources where possible.
Only output sections related to market research, sizing, and competitor analysis. Do NOT repeat or recreate product features, engineering tasks, or marketing copy. Be highly concise.`,
  },

  "product-manager": {
    id: "product-manager",
    name: "Product Manager",
    description: "Creates PRD, user stories, and product roadmap",
    icon: "ClipboardList",
    color: "indigo",
    model: "llama-3.3-70b-versatile",
    maxTokens: 800,
    wave: 2,
    // No tools — works from previous agents' context
    systemPrompt: `You are a senior product manager at a top tech company.
You will receive the startup idea, the advisor validation, and the market research output.
Using all three, create:
1. Product Vision Statement — One clear sentence.
2. User Stories — At least 5 stories with priority (high/medium/low) and epic labels.
3. Product Roadmap — 3 phases: MVP, Growth, Scale with specific features per phase.
4. Success Metrics — Measurable indicators of product-market fit.
Only output sections related to product vision, user stories, and roadmap. Do NOT summarize or repeat the general market research data or developer details. Be highly concise.`,
  },

  "architect": {
    id: "architect",
    name: "Software Architect",
    description: "Designs database schema, API contracts, and system architecture",
    icon: "Blocks",
    color: "amber",
    model: "llama-3.3-70b-versatile",
    maxTokens: 1500,
    wave: 3,
    // No tools — works from PM's output
    systemPrompt: `You are a senior software architect.
You will receive the startup idea, market research, and the full PRD from the product manager.
Using all of them, design:
1. Database Schema — Tables, columns, types, and relationships.
2. API Design — Key endpoints with request and response shapes.
3. System Architecture — High-level components and data flow.
4. Technology Recommendations — Stack choices with clear justification.
Design for scalability from day one. Name everything clearly and consistently.
Only output these 4 technical architecture sections. Do NOT generate sections for market sizing, competitor analysis, marketing, or general business ideas. Be highly concise.`,
  },

  "engineering-manager": {
    id: "engineering-manager",
    name: "Engineering Manager",
    description: "Creates GitHub issues and sprint plans",
    icon: "GitBranch",
    color: "purple",
    model: "llama-3.1-8b-instant",
    maxTokens: 800,
    wave: 3,
    // No tools — works from architect's output
    systemPrompt: `You are an engineering manager planning a sprint for a team of 2 to 3 engineers.
You will receive the PRD and the system architecture from the architect.
Using both, create:
1. GitHub Issues — At least 6 issues, each with a title, labels (feature/auth/infra/ui/ai),
   priority (P1/P2/P3), and story point estimate (1 to 8).
2. Sprint Plan — Organize the issues into a 2-week sprint across To Do, In Progress, Done.
Be practical. Prioritize what a small team can realistically ship.
Only output the sprint plan and GitHub issues. Do NOT summarize the entire system architecture or product roadmap. Be highly concise.`,
  },

  "marketing": {
    id: "marketing",
    name: "Marketing Agent",
    description: "Creates landing page copy, social posts, and campaigns",
    icon: "Megaphone",
    color: "rose",
    model: "llama-3.1-8b-instant",
    maxTokens: 800,
    wave: 2,
    tools: ["search"],  // Can search for competitor messaging, trending topics
    systemPrompt: `You are a senior growth marketer and startup copywriter.
You will receive the startup idea and the market research output.
Using both, create:
1. Landing Page Copy — Hero headline, subheadline, primary CTA, and one line of social proof.
2. LinkedIn Launch Post — Engaging, with relevant hashtags.
3. Email Subject Lines — 3 options, each with a different angle (curiosity/urgency/benefit).
4. Campaign Strategy — A concise go-to-market messaging strategy.
Only output the marketing copy and launch campaign strategy. Do NOT generate sections for competitor lists or code architectures. Be highly concise.`,
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
