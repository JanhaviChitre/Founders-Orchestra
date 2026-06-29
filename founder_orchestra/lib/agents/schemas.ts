/**
 * =============================================================================
 * DISCRETE PER-AGENT ZOD SCHEMAS & TYPES
 * =============================================================================
 *
 * Defines explicit Zod validation schemas for all 6 agents.
 * Each agent returns structured JSON optimized for direct UI rendering.
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// 1. STARTUP ADVISOR SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const startupAdvisorOutputSchema = z.object({
  validation_summary: z.string(),
  pmf_score: z.object({
    score: z.number(),
    label: z.string(),
    signal: z.string(),
  }),
  tam: z.object({
    value: z.string(),
    growth_rate: z.string(),
    direction: z.enum(["positive", "negative"]),
    description: z.string(),
  }),
  competitors_mapped: z.object({
    count: z.number(),
    description: z.string(),
  }),
  risk_level: z.enum(["Low", "Medium", "High"]),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.string(),
      type: z.string(),
    })
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. MARKET RESEARCH SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const marketResearchOutputSchema = z.object({
  summary: z.string(),
  market_sizing: z.object({
    tam: z.object({ value: z.string(), numeric: z.number() }),
    sam: z.object({ value: z.string(), numeric: z.number() }),
    som: z.object({ value: z.string(), numeric: z.number() }),
    insight: z.string(),
  }),
  competitors: z.array(
    z.object({
      name: z.string(),
      tag: z.string(),
      strengths: z.string(),
      weaknesses: z.string(),
      price_per_month: z.string(),
      threat_level: z.enum(["low", "medium", "high"]),
      scores: z.object({
        ai_capability: z.number(),
        personalization: z.number(),
      }),
    })
  ),
  trends: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      momentum: z.string(),
      direction: z.enum(["up", "down"]),
      growth_percent: z.number(),
    })
  ),
  market_gaps: z.array(
    z.object({
      segment: z.string(),
      description: z.string(),
      opportunity: z.enum(["low", "medium", "high"]),
    })
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCT MANAGER SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const productManagerOutputSchema = z.object({
  summary: z.string(),
  product_vision: z.string(),
  user_stories: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      epic: z.string(),
    })
  ),
  roadmap: z.array(
    z.object({
      phase: z.enum(["MVP", "Growth", "Scale"]),
      label: z.string(),
      quarter: z.enum(["q1", "q2", "q3"]),
      features: z.array(z.string()),
    })
  ),
  success_metrics: z.array(
    z.object({
      metric: z.string(),
      target: z.string(),
      timeframe: z.string(),
    })
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. MARKETING AGENT SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const marketingOutputSchema = z.object({
  summary: z.string(),
  landing_page: z.object({
    headline: z.string(),
    subheadline: z.string(),
    cta: z.string(),
    social_proof: z.string(),
  }),
  linkedin_post: z.object({
    content: z.string(),
    hashtags: z.array(z.string()),
  }),
  email_subjects: z.array(
    z.object({
      angle: z.enum(["curiosity", "urgency", "benefit"]),
      subject: z.string(),
    })
  ),
  campaign_strategy: z.object({
    positioning: z.string(),
    key_message: z.string(),
    channels: z.array(z.string()),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. SOFTWARE ARCHITECT SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const architectOutputSchema = z.object({
  summary: z.string(),
  database_schema: z.array(
    z.object({
      table: z.string(),
      columns: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          is_pk: z.boolean(),
          is_fk: z.boolean(),
          nullable: z.boolean(),
        })
      ),
    })
  ),
  api_endpoints: z.array(
    z.object({
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      path: z.string(),
      description: z.string(),
      auth_required: z.boolean(),
    })
  ),
  system_components: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technology: z.string(),
    })
  ),
  tech_stack: z.array(
    z.object({
      technology: z.string(),
      category: z.enum(["frontend", "backend", "database", "infra", "ai"]),
      justification: z.string(),
    })
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENGINEERING MANAGER SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
export const engineeringManagerOutputSchema = z.object({
  summary: z.string(),
  github_issues: z.array(
    z.object({
      number: z.string(),
      title: z.string(),
      labels: z.array(z.string()),
      priority: z.enum(["P1", "P2", "P3"]),
      story_points: z.number(),
      epic: z.string(),
    })
  ),
  sprint_plan: z.object({
    duration_weeks: z.number(),
    phases: z.array(
      z.object({
        phase_number: z.number(),
        name: z.string(),
        duration_days: z.string(),
        tasks: z.array(z.string()),
      })
    ),
    todo: z.array(z.string()).optional(),
    in_progress: z.array(z.string()).optional(),
    done: z.array(z.string()).optional(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// INFERRED TYPES & DISCRIMINATED UNIONS
// ─────────────────────────────────────────────────────────────────────────────

export type StartupAdvisorData = z.infer<typeof startupAdvisorOutputSchema>;
export type MarketResearchData = z.infer<typeof marketResearchOutputSchema>;
export type ProductManagerData = z.infer<typeof productManagerOutputSchema>;
export type MarketingData = z.infer<typeof marketingOutputSchema>;
export type ArchitectData = z.infer<typeof architectOutputSchema>;
export type EngineeringManagerData = z.infer<typeof engineeringManagerOutputSchema>;

export type ExecutionMetadata = {
  status: "idle" | "running" | "completed" | "error";
  startedAt?: string;
  completedAt?: string;
  error?: string;
  latestReasoning?: string;
  title?: string;
};

export type StartupAdvisorOutput = ExecutionMetadata & StartupAdvisorData & { agentId: "startup-advisor" };
export type MarketResearchOutput = ExecutionMetadata & MarketResearchData & { agentId: "market-research" };
export type ProductManagerOutput = ExecutionMetadata & ProductManagerData & { agentId: "product-manager" };
export type MarketingOutput = ExecutionMetadata & MarketingData & { agentId: "marketing" };
export type ArchitectOutput = ExecutionMetadata & ArchitectData & { agentId: "architect" };
export type EngineeringManagerOutput = ExecutionMetadata & EngineeringManagerData & { agentId: "engineering-manager" };

export type AgentOutputUnion =
  | StartupAdvisorOutput
  | MarketResearchOutput
  | ProductManagerOutput
  | MarketingOutput
  | ArchitectOutput
  | EngineeringManagerOutput;
