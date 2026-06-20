/**
 * =============================================================================
 * ORCHESTRATOR — Coordinates all AI agents
 * =============================================================================
 *
 * The orchestrator runs the multi-agent pipeline in waves.
 * It decides WHEN and HOW to run each agent, and routes
 * tool-enabled agents through `runAgentWithTools()`.
 *
 * EXECUTION FLOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Wave 1 (parallel):  Startup Advisor + Market Research       │
 * │         ↓ (wave 1 results feed into wave 2)                 │
 * │ Wave 2 (parallel):  Product Manager + Marketing             │
 * │         ↓ (wave 1+2 results feed into wave 3)               │
 * │ Wave 3 (parallel):  Architect + Engineering Manager         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { runAgent, runAgentWithTools } from "@/lib/agents/base-agent";
import { getAgentsByWave, AGENT_CONFIGS } from "@/lib/agents/config";
import type { AgentId, AgentOutput, StartupInput } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// CALLBACK TYPE
// ─────────────────────────────────────────────────────────────────────────────

type OnProgressCallback = (event: {
  type:
    | "agent-start"
    | "agent-progress"
    | "agent-complete"
    | "agent-error";
  agentId: AgentId;
  partialText?: string;
  output?: AgentOutput;
  error?: string;
}) => void;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ORCHESTRATION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs the complete multi-agent pipeline.
 * Routes agents WITH tools through runAgentWithTools() and
 * agents WITHOUT tools through runAgent().
 */
export async function orchestrate(
  input: StartupInput,
  onProgress?: OnProgressCallback,
  targetWaves: readonly (1 | 2 | 3)[] = [1, 2, 3],
  targetAgents?: AgentId[]
): Promise<Record<AgentId, AgentOutput>> {
  const results: Partial<Record<AgentId, AgentOutput>> = {};

  for (const wave of targetWaves) {
    let waveAgents = getAgentsByWave(wave);
    if (targetAgents) {
      waveAgents = waveAgents.filter((a) => targetAgents.includes(a.id));
    }
    if (waveAgents.length === 0) continue;
    const contextFromPreviousWaves = buildContext(results, input.previousResults); // We will need to pass previousResults if resuming

    for (const agentConfig of waveAgents) {

      // ── Notify: agent starting ──────────────────────────────────────
      onProgress?.({ type: "agent-start", agentId: agentConfig.id });

      try {
        // ── Choose the right runner based on tools ─────────────────────
        const hasTools = agentConfig.tools && agentConfig.tools.length > 0;
        const output = hasTools
          ? await runAgentWithTools(
              agentConfig,
              input,
              wave > 1 ? contextFromPreviousWaves : undefined,
              (partialText) =>
                onProgress?.({
                  type: "agent-progress",
                  agentId: agentConfig.id,
                  partialText,
                })
            )
          : await runAgent(
              agentConfig,
              input,
              wave > 1 ? contextFromPreviousWaves : undefined,
              (partialText) =>
                onProgress?.({
                  type: "agent-progress",
                  agentId: agentConfig.id,
                  partialText,
                })
            );

        results[agentConfig.id] = output;

        // ── Notify: agent completed ───────────────────────────────────
        onProgress?.({
          type: output.status === "completed" ? "agent-complete" : "agent-error",
          agentId: agentConfig.id,
          output,
          error: output.error,
        });
      } catch (error) {
        const errorOutput: AgentOutput = {
          agentId: agentConfig.id,
          status: "error",
          title: `${agentConfig.name} — Failed`,
          summary: "Agent encountered an unexpected error",
          sections: [],
          metadata: {},
          error: error instanceof Error ? error.message : "Unknown error",
        };

        results[agentConfig.id] = errorOutput;

        onProgress?.({
          type: "agent-error",
          agentId: agentConfig.id,
          error: errorOutput.error,
        });
      }
    }
  }

  return results as Record<AgentId, AgentOutput>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Build context string from completed agents
// ─────────────────────────────────────────────────────────────────────────────

function buildContext(
  results: Partial<Record<AgentId, AgentOutput>>,
  previousResults?: Record<string, any>
): string {
  // Merge current wave results with previous results for full context
  const merged = { ...(previousResults || {}), ...results };
  const entries = Object.entries(merged);
  if (entries.length === 0) return "";

  return entries
    .filter(([, output]) => output?.status === "completed")
    .map(([agentId, output]) => {
      const config = AGENT_CONFIGS[agentId as AgentId];
      // Fallback name if agentId isn't in config (e.g. legacy/mock data)
      const name = config?.name || agentId;
      return `### ${name}\n${output.summary}\n${
        output.sections?.map((s: any) => `#### ${s.heading}\n${s.content}`).join("\n\n") || ""
      }`;
    })
    .join("\n\n---\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Run a single agent (for re-running one agent)
// ─────────────────────────────────────────────────────────────────────────────

export async function runSingleAgent(
  agentId: AgentId,
  input: StartupInput,
  existingResults?: Partial<Record<AgentId, AgentOutput>>
): Promise<AgentOutput> {
  const config = AGENT_CONFIGS[agentId];
  const context = existingResults ? buildContext(existingResults) : undefined;
  const hasTools = config.tools && config.tools.length > 0;
  return hasTools
    ? runAgentWithTools(config, input, context)
    : runAgent(config, input, context);
}
