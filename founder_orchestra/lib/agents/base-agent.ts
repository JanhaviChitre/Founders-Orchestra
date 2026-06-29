/**
 * =============================================================================
 * BASE AGENT — LangGraph-powered AI agent runner
 * =============================================================================
 *
 * This file provides functions that RUN AI agents using LangChain/LangGraph.
 * We utilize ChatGroq with llama-3.3-70b-versatile and native per-agent structured outputs.
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import type { AgentConfig, AgentOutputUnion, StartupInput } from "@/lib/types";

type AgentProgressCallback = (partialText: string) => void;

let isExaOffline = false;

// Dynamic round-robin key alternation to distribute API rate limits across all keys in .env
function getGroqKeys(): string[] {
  const keys = Object.keys(process.env)
    .filter((key) => key.startsWith("GROQ_API_KEY_"))
    .sort()
    .map((key) => process.env[key])
    .filter(Boolean) as string[];

  if (keys.length === 0 && process.env.GROQ_API_KEY) {
    keys.push(process.env.GROQ_API_KEY);
  }
  return keys;
}

let keyIndex = 0;
function getNextKey(): string {
  const keys = getGroqKeys();
  if (keys.length === 0) return process.env.GROQ_API_KEY || "";
  const key = keys[keyIndex % keys.length];
  keyIndex = (keyIndex + 1) % keys.length;
  return key;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT (No Tools) — Direct structured output
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs an AI agent WITHOUT tools (PM, Architect, Eng Manager).
 */
export async function runAgent(
  config: AgentConfig,
  input: StartupInput,
  context?: string,
  onProgress?: AgentProgressCallback
): Promise<AgentOutputUnion> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  const maxAttempts = Math.max(5, getGroqKeys().length);

  console.log(`[Agent: ${config.name}] 🎬 Initializing execution (Model: ${config.model})`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apiKey = getNextKey();
      const maskedKey = apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "key-set";
      console.log(`[Agent: ${config.name}] 🔑 Attempt ${attempt}/${maxAttempts} using API key (${maskedKey})`);

      const userPrompt = buildPrompt(input, context);
      console.log(`[Agent: ${config.name}] 📝 Prompt constructed (${userPrompt.length} chars, Context: ${context ? "Yes" : "No"})`);

      const model = new ChatGroq({
        model: config.model,
        apiKey: apiKey,
        temperature: 0.2,
        maxTokens: config.maxTokens,
      });

      console.log(`[Agent: ${config.name}] ⚡ Invoking ChatGroq structured extraction...`);
      onProgress?.("Synthesizing structured agent output...");

      const result = await model.withStructuredOutput(config.outputSchema).invoke([
        new SystemMessage(config.systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      const elapsed = Date.now() - startTime;
      console.log(`[Agent: ${config.name}] 🎉 Execution completed successfully in ${elapsed}ms`);

      return {
        agentId: config.id,
        status: "completed",
        startedAt,
        completedAt: new Date().toISOString(),
        ...result,
      } as AgentOutputUnion;
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      const isRateLimitOrBadRequest =
        error?.status === 400 ||
        error?.status === 429 ||
        errorMsg.includes("400") ||
        errorMsg.includes("429") ||
        errorMsg.includes("rate_limit") ||
        errorMsg.includes("tool_use_failed");

      if (isRateLimitOrBadRequest && attempt < maxAttempts) {
        console.warn(
          `[Agent: ${config.name}] ⚠️ API key failed (Status: ${error?.status || "unknown"}, Msg: ${errorMsg.substring(0, 80)}). Retrying attempt ${attempt + 1}...`
        );
        continue;
      }

      console.error(`[Agent: ${config.name}] ❌ Error during execution:`, error);
      return createErrorOutput(config, startedAt, error);
    }
  }
  return createErrorOutput(
    config,
    startedAt,
    new Error("All Groq API keys exhausted or failed.")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT WITH TOOLS — LangGraph ReAct agent + Exa AI web search
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs an AI agent WITH tools (Advisor, Market Research, Marketing).
 */
export async function runAgentWithTools(
  config: AgentConfig,
  input: StartupInput,
  context?: string,
  onProgress?: AgentProgressCallback
): Promise<AgentOutputUnion> {
  const startedAt = new Date().toISOString();

  console.log(`[Agent: ${config.name} (Tools)] 🎬 Initializing web research agent...`);

  const exaKey = (process.env as any).EXA_API_KEY;
  if (isExaOffline || !exaKey || exaKey.includes("placeholder")) {
    console.warn(
      `[Agent: ${config.name} (Tools)] ⚠️ Exa AI search is offline or API key missing. Bypassing search and running direct model extraction.`
    );
    onProgress?.("Web search is currently offline. Utilizing internal knowledge base...");
    return runAgent(config, input, context, onProgress);
  } else {
    console.log(`[Agent: ${config.name} (Tools)] 🌐 Exa AI API key active and verified.`);
  }

  const maxAttempts = Math.max(5, getGroqKeys().length);
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      onProgress?.("Initiating web research and market analysis via Exa AI...");

      let webResearchContext = "";
      const key = process.env.EXA_API_KEY;
      if (key && !isExaOffline) {
        try {
          const searchQuery = `${input.industry || ""} ${input.idea} real competitors market alternatives top software companies`;
          console.log(`[Agent: ${config.name} (Tools)] 🔍 Executing Exa search: "${searchQuery}"`);
          onProgress?.(`Searching via Exa: "${searchQuery}"`);

          const response = await fetch("https://api.exa.ai/search", {
            method: "POST",
            headers: {
              "x-api-key": key,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: searchQuery,
              type: "auto",
              numResults: 5,
              useAutoprompt: true,
              contents: {
                highlights: { numSentences: 3, highlightsPerUrl: 2 },
                text: { maxCharacters: 800 },
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.results && Array.isArray(data.results) && data.results.length > 0) {
              console.log(`[Agent: ${config.name} (Tools)] ✅ Retracted ${data.results.length} live web results from Exa AI`);
              const formattedResults = data.results
                .map((r: any, idx: number) => {
                  const title = r.title || "No Title";
                  const url = r.url || "";
                  const highlights = Array.isArray(r.highlights) && r.highlights.length > 0
                    ? r.highlights.join(" ")
                    : r.text || r.snippet || "";
                  return `[Live Web Result ${idx + 1}] ${title}\nURL: ${url}\nHighlights: ${highlights}`;
                })
                .join("\n\n");
              webResearchContext = `\n\n=== LIVE WEB RESEARCH CONTEXT (Exa AI) ===\n${formattedResults}\n=========================================\nUse the live web research context above to inform your analysis.`;
            } else {
              console.log(`[Agent: ${config.name} (Tools)] ℹ️ Exa AI returned zero search results for query.`);
            }
          } else if (response.status === 401 || response.status === 403) {
            console.warn(`[Agent: ${config.name} (Tools)] ❌ ExaSearch API status ${response.status}. Marking Exa offline.`);
            isExaOffline = true;
          }
        } catch (err: any) {
          console.warn(`[Agent: ${config.name} (Tools)] ❌ ExaSearch Error:`, err.message || err);
          isExaOffline = true;
        }
      }

      console.log(`[Agent: ${config.name} (Tools)] 🔄 Handing over research context to structured LLM extraction...`);
      onProgress?.("Synthesizing structured agent blueprint...");
      const fullContext = context ? `${context}${webResearchContext}` : webResearchContext;
      return runAgent(config, input, fullContext.trim() || undefined, onProgress);
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      const isRateLimitOrBadRequest =
        error?.status === 400 ||
        error?.status === 429 ||
        errorMsg.includes("400") ||
        errorMsg.includes("429") ||
        errorMsg.includes("rate_limit") ||
        errorMsg.includes("tool_use_failed");

      if (isRateLimitOrBadRequest && attempt < maxAttempts) {
        console.warn(
          `[Agent: ${config.name}] API key failed in tool agent (Status: ${error?.status || "unknown"}, Msg: ${errorMsg.substring(0, 100)}). Retrying (attempt ${attempt}/${maxAttempts})...`
        );
        continue;
      }

      console.error(`[Agent: ${config.name}] Error (with tools):`, error);
      return createErrorOutput(config, startedAt, error);
    }
  }
  return createErrorOutput(
    config,
    startedAt,
    new Error("All Groq API keys exhausted or failed in tool agent.")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Build the user prompt from input + optional context */
function buildPrompt(input: StartupInput, context?: string): string {
  let prompt = `
## Startup Idea to Analyze

**Startup Name:** ${input.startupName}
**Core Idea:** ${input.idea}
`;

  if (input.industry) prompt += `**Industry:** ${input.industry}\n`;
  if (input.targetAudience) prompt += `**Target Audience:** ${input.targetAudience}\n`;
  if (input.budget) prompt += `**Budget Range:** ${input.budget}\n`;
  if (input.additionalContext) prompt += `**Additional Context:** ${input.additionalContext}\n`;

  if (context) {
    prompt += `
## Context from Previous Analysis
The following analysis has already been completed by other agents.
Use this information to provide more relevant and connected output.

${context}
`;
  }

  return prompt;
}

/** Create a standardized error output */
function createErrorOutput(
  config: AgentConfig,
  startedAt: string,
  error: unknown
): AgentOutputUnion {
  return {
    agentId: config.id as any,
    status: "error",
    startedAt,
    completedAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : "Unknown error occurred",
  } as AgentOutputUnion;
}
