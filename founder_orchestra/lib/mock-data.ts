/**
 * =============================================================================
 * MOCK DATA — Sample project data matching the new discrete schemas
 * =============================================================================
 *
 * Provides a complete mock project matching the 6 per-agent discrete Zod schemas.
 *
 * Owner: Shared
 * =============================================================================
 */

import type { AgentId, AgentOutputUnion, StartupInput, OrchestrationStatus } from "@/lib/types";

const MOCK_INPUT: StartupInput = {
  startupName: "FitCoach AI",
  idea: "AI-powered fitness coach for busy professionals",
  industry: "Health & Fitness",
  targetAudience: "Busy professionals aged 25-45",
};

const MOCK_AGENTS: Record<AgentId, AgentOutputUnion> = {
  "startup-advisor": {
    agentId: "startup-advisor",
    status: "completed",
    startedAt: "2026-01-01T00:00:00Z",
    completedAt: "2026-01-01T00:00:10Z",
    validation_summary: "Idea validated — strong PMF signals detected.",
    pmf_score: { score: 82, label: "Strong PMF", signal: "High Market Demand" },
    tam: { value: "$42B", growth_rate: "+14%", direction: "positive", description: "Global fitness app market by 2028" },
    competitors_mapped: { count: 7, description: "Mapped 7 direct and indirect fitness platforms" },
    risk_level: "Medium",
    sections: [
      { heading: "Problem-Solution Fit", content: "The fitness app market is oversaturated but lacks AI personalization for time-constrained professionals.", type: "analysis" },
    ],
  },

  "market-research": {
    agentId: "market-research",
    status: "completed",
    startedAt: "2026-01-01T00:00:00Z",
    completedAt: "2026-01-01T00:00:12Z",
    summary: "TAM $42B · 7 competitors mapped · 5 trends",
    market_sizing: {
      tam: { value: "$42B", numeric: 42000000000 },
      sam: { value: "$9.8B", numeric: 9800000000 },
      som: { value: "$490M", numeric: 490000000 },
      insight: "Focusing on time-poor executives unlocks high-margin subscription potential.",
    },
    competitors: [
      { name: "Whoop", tag: "Recovery Wearable", strengths: "Strain tracking", weaknesses: "No workout generator", price_per_month: "$30", threat_level: "high", scores: { ai_capability: 75, personalization: 80 } },
      { name: "Fitbod", tag: "Workout Generator", strengths: "Gym tracking", weaknesses: "Generic recommendations", price_per_month: "$13", threat_level: "medium", scores: { ai_capability: 60, personalization: 65 } },
    ],
    trends: [
      { name: "AI Personalization", description: "Adaptive real-time workouts", momentum: "+187%", direction: "up", growth_percent: 187 },
      { name: "Micro-workouts", description: "<15 min sessions", momentum: "+211%", direction: "up", growth_percent: 211 },
    ],
    market_gaps: [
      { segment: "Busy Executives", description: "Lack time for 60m gym sessions", opportunity: "high" },
    ],
  },

  "product-manager": {
    agentId: "product-manager",
    status: "completed",
    startedAt: "2026-01-01T00:00:12Z",
    completedAt: "2026-01-01T00:00:22Z",
    summary: "PRD drafted · 12 user stories · 3-phase roadmap",
    product_vision: "Empower busy professionals to achieve peak fitness with 15-minute hyper-personalized AI workout routines.",
    user_stories: [
      { id: "US-001", text: "As a user, I want an AI workout generated based on my available equipment.", priority: "high", epic: "Workout Engine" },
    ],
    roadmap: [
      { phase: "MVP", label: "Core AI Generator", quarter: "q1", features: ["Auth & Onboarding", "AI Routine Generator", "Progress Log"] },
      { phase: "Growth", label: "Wearable Sync", quarter: "q2", features: ["Apple Health Sync", "Social Leaderboards"] },
    ],
    success_metrics: [
      { metric: "D30 Retention", target: "35%", timeframe: "6 months" },
    ],
  },

  architect: {
    agentId: "architect",
    status: "running",
    startedAt: "2026-01-01T00:00:22Z",
    summary: "Designing DB schema and API contracts…",
    database_schema: [
      {
        table: "users",
        columns: [
          { name: "id", type: "uuid", is_pk: true, is_fk: false, nullable: false },
          { name: "email", type: "varchar(255)", is_pk: false, is_fk: false, nullable: false },
          { name: "full_name", type: "varchar(100)", is_pk: false, is_fk: false, nullable: true },
          { name: "role", type: "varchar(50)", is_pk: false, is_fk: false, nullable: false },
          { name: "created_at", type: "timestamp", is_pk: false, is_fk: false, nullable: false },
        ],
      },
      {
        table: "workspaces",
        columns: [
          { name: "id", type: "uuid", is_pk: true, is_fk: false, nullable: false },
          { name: "owner_id", type: "uuid", is_pk: false, is_fk: true, nullable: false },
          { name: "name", type: "varchar(100)", is_pk: false, is_fk: false, nullable: false },
          { name: "plan", type: "varchar(50)", is_pk: false, is_fk: false, nullable: false },
          { name: "created_at", type: "timestamp", is_pk: false, is_fk: false, nullable: false },
        ],
      },
      {
        table: "workflows",
        columns: [
          { name: "id", type: "uuid", is_pk: true, is_fk: false, nullable: false },
          { name: "workspace_id", type: "uuid", is_pk: false, is_fk: true, nullable: false },
          { name: "title", type: "varchar(200)", is_pk: false, is_fk: false, nullable: false },
          { name: "config_json", type: "jsonb", is_pk: false, is_fk: false, nullable: true },
          { name: "status", type: "varchar(50)", is_pk: false, is_fk: false, nullable: false },
          { name: "updated_at", type: "timestamp", is_pk: false, is_fk: false, nullable: false },
        ],
      },
      {
        table: "audit_logs",
        columns: [
          { name: "id", type: "bigint", is_pk: true, is_fk: false, nullable: false },
          { name: "user_id", type: "uuid", is_pk: false, is_fk: true, nullable: false },
          { name: "action", type: "varchar(100)", is_pk: false, is_fk: false, nullable: false },
          { name: "ip_address", type: "varchar(45)", is_pk: false, is_fk: false, nullable: true },
          { name: "created_at", type: "timestamp", is_pk: false, is_fk: false, nullable: false },
        ],
      },
    ],
    api_endpoints: [
      { method: "POST", path: "/api/workouts/generate", description: "Generate AI workout", auth_required: true },
    ],
    system_components: [
      { name: "API Gateway", description: "Next.js Route Handlers", technology: "Next.js" },
    ],
    tech_stack: [
      { technology: "PostgreSQL", category: "database", justification: "Reliable relational storage" },
    ],
  },

  "engineering-manager": {
    agentId: "engineering-manager",
    status: "idle",
    summary: "Waiting for architecture output",
    github_issues: [],
    sprint_plan: {
      duration_weeks: 2,
      phases: [
        { phase_number: 1, name: "Database & Infra Setup", duration_days: "Days 1–4", tasks: ["Set up Prisma ORM & PostgreSQL migrations", "Configure Next.js authentication API routes"] },
        { phase_number: 2, name: "Core Engine & APIs", duration_days: "Days 5–9", tasks: ["Build core recommendation engine endpoints", "Develop dashboard component state management"] },
        { phase_number: 3, name: "Testing & CI/CD Release", duration_days: "Days 10–14", tasks: ["Implement integration unit test suite", "Configure Vercel automated deployment pipeline"] },
      ],
      todo: [],
      in_progress: [],
      done: [],
    },
  },

  marketing: {
    agentId: "marketing",
    status: "idle",
    summary: "Waiting for PRD finalization",
    landing_page: { headline: "", subheadline: "", cta: "", social_proof: "" },
    linkedin_post: { content: "", hashtags: [] },
    email_subjects: [],
    campaign_strategy: { positioning: "", key_message: "", channels: [] },
  },
};

export const MOCK_PROJECT = {
  input: MOCK_INPUT,
  agents: MOCK_AGENTS,
  overallStatus: "in-progress" as OrchestrationStatus,
};
