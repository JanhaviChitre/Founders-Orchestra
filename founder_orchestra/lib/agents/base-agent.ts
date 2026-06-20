/**
 * =============================================================================
 * BASE AGENT — LangGraph-powered AI agent runner
 * =============================================================================
 *
 * This file provides functions that RUN AI agents using LangChain/LangGraph.
 * We utilize ChatGroq with llama-3.3-70b-versatile and native structured output.
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { TavilySearch } from "@langchain/tavily";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import type { AgentConfig, AgentOutput, StartupInput } from "@/lib/types";
import { jsonrepair } from "jsonrepair";

type AgentProgressCallback = (partialText: string) => void;

let isTavilyOffline = false;

// Round-robin key alternation to distribute API rate limits
const groqKeys = Object.keys(process.env)
  .filter(key => key.startsWith("GROQ_API_KEY_"))
  .sort()
  .map(key => process.env[key])
  .filter(Boolean) as string[];

if (groqKeys.length === 0 && process.env.GROQ_API_KEY) {
  groqKeys.push(process.env.GROQ_API_KEY);
}

let keyIndex = 0;
const getNextKey = () => groqKeys[keyIndex++ % groqKeys.length];

function getFailedGeneration(error: any): string | undefined {
  if (!error) return undefined;
  if (error.error?.error?.failed_generation) return error.error.error.failed_generation;
  if (error.failed_generation) return error.failed_generation;
  
  const msg = error.message;
  if (typeof msg === "string") {
    try {
      const firstBrace = msg.indexOf("{");
      if (firstBrace !== -1) {
        const parsed = JSON.parse(msg.substring(firstBrace));
        const gen = parsed?.error?.failed_generation || parsed?.failed_generation;
        if (typeof gen === "string") return gen;
      }
    } catch (_) {
      // Ignore parsing errors
    }
    return msg;
  }
  return undefined;
}

function sanitizeParsedOutput(parsed: any) {
  if (!parsed || typeof parsed !== "object") return;
  
  if (!parsed.metadata) {
    parsed.metadata = {};
  } else if (typeof parsed.metadata === "object") {
    for (const key of Object.keys(parsed.metadata)) {
      if (parsed.metadata[key] !== undefined && parsed.metadata[key] !== null) {
        parsed.metadata[key] = String(parsed.metadata[key]);
      }
    }
  }

  if (Array.isArray(parsed.sections)) {
    const allowedKeys = ["heading", "content", "data", "chartType", "tableData"];
    const allowedChartTypes = ["bar", "pie", "radar", "line", "area", "funnel"];
    for (const section of parsed.sections) {
      if (section && typeof section === "object") {
        // Strip additional keys that are not allowed by Zod
        for (const key of Object.keys(section)) {
          if (!allowedKeys.includes(key)) {
            delete section[key];
          }
        }
        
        // Sanitize chartType
        if (section.chartType && !allowedChartTypes.includes(section.chartType)) {
          delete section.chartType;
        }
        
        // Sanitize chart data points
        if (Array.isArray(section.data)) {
          for (const pt of section.data) {
            if (pt && typeof pt === "object") {
              if (pt.name !== undefined && typeof pt.name !== "string") {
                pt.name = String(pt.name);
              }
              if (pt.value === undefined) {
                pt.value = 0;
              } else if (typeof pt.value !== "number") {
                const parsedVal = Number(pt.value);
                if (!isNaN(parsedVal)) {
                  pt.value = parsedVal;
                } else if (typeof pt.value === "string") {
                  const items = pt.value.split(",").map((s: string) => s.trim()).filter(Boolean);
                  pt.value = items.length || 0;
                } else {
                  pt.value = 0;
                }
              }
            }
          }
        }

        // Sanitize tableData
        if (section.tableData && typeof section.tableData === "object") {
          const td = section.tableData;
          if (Array.isArray(td.headers)) {
            td.headers = td.headers.map((h: any) => String(h === undefined || h === null ? "" : h));
          } else {
            td.headers = [];
          }
          if (Array.isArray(td.rows)) {
            td.rows = td.rows.map((row: any) => {
              if (Array.isArray(row)) {
                return row.map((cell: any) => String(cell === undefined || cell === null ? "" : cell));
              }
              return [];
            });
          } else {
            td.rows = [];
          }
        }
      }
    }
  }
}

function getMessageText(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((c) => {
      if (typeof c === "string") return c;
      if (c && typeof c === "object") {
        if (typeof c.text === "string") return c.text;
        if (typeof c.content === "string") return c.content;
      }
      return "";
    }).filter(Boolean).join("\n");
  }
  if (typeof content === "object") {
    if (typeof content.text === "string") return content.text;
    if (typeof content.content === "string") return content.content;
  }
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT SCHEMA (Zod)
// ─────────────────────────────────────────────────────────────────────────────
// Zod validates that the AI returns data in the exact shape we expect.

/** Schema for a single chart data point */
const chartDataPointSchema = z.object({
  name: z.string().describe("Label for this data point"),
  value: z.number().describe("Numeric value"),
});

/** Schema for table data */
const tableDataSchema = z.object({
  headers: z.array(z.string()).describe("Column headers"),
  rows: z.array(z.array(z.string())).describe("Table rows"),
});

/** Schema for one section of the agent's output */
const outputSectionSchema = z.object({
  heading: z.string().describe("Section title"),
  content: z.string().describe("Detailed content in Markdown format"),
  data: z.array(chartDataPointSchema).optional()
    .describe("Optional chart data points for visualization"),
  chartType: z.enum(["bar", "pie", "radar", "line", "area", "funnel"]).optional()
    .describe("Type of chart to render with the data"),
  tableData: tableDataSchema.optional()
    .describe("Optional table data"),
});

const agentOutputSchema = z.object({
  title: z.string().describe("Title of this analysis"),
  summary: z.string().describe("1-2 sentence executive summary"),
  sections: z.array(outputSectionSchema)
    .describe("Detailed output broken into logical sections"),
  metadata: z.object({
    viabilityScore: z.string().optional().describe("0-100 PMF viability score"),
    riskLevel: z.string().optional().describe("Risk level: Low/Medium/High"),
    tam: z.string().optional().describe("Total Addressable Market, e.g. $42B"),
    competitorCount: z.string().optional().describe("Number of competitors mapped"),
    trendCount: z.string().optional().describe("Number of market trends mapped"),
    totalIssues: z.string().optional().describe("Total GitHub issues generated"),
    storyCount: z.string().optional().describe("Number of user stories"),
    epicCount: z.string().optional().describe("Number of epics"),
    phaseCount: z.string().optional().describe("Number of roadmap phases"),
  }).describe("Extra metadata like scores, counts, or key metrics"),
});

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT (No Tools) — Direct structured output
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs an AI agent WITHOUT tools (PM, Architect, Eng Manager).
 *
 * @param config   - The agent's configuration (from config.ts)
 * @param input    - The founder's startup idea
 * @param context  - Optional: outputs from previous agents
 * @returns        - The structured AgentOutput
 */
export async function runAgent(
  config: AgentConfig,
  input: StartupInput,
  context?: string,
  onProgress?: AgentProgressCallback
): Promise<AgentOutput> {
  const startedAt = new Date().toISOString();
  const maxAttempts = Math.max(5, groqKeys.length);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apiKey = getNextKey();
      const userPrompt = buildPrompt(input, context);

      const model = new ChatGroq({
        model: config.model,
        apiKey: apiKey,
        temperature: 0.2,
        maxTokens: config.maxTokens,
      });

      const result = await model.withStructuredOutput(agentOutputSchema).invoke([
        new SystemMessage(config.systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      return {
        agentId: config.id,
        status: "completed",
        title: result.title,
        summary: result.summary,
        sections: result.sections,
        metadata: result.metadata,
        startedAt,
        completedAt: new Date().toISOString(),
      };
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
        console.warn(`[Agent: ${config.name}] API key failed (Status: ${error?.status || 'unknown'}, Msg: ${errorMsg.substring(0, 100)}). Retrying (attempt ${attempt}/${maxAttempts})...`);
        continue;
      }

      const failedGen = getFailedGeneration(error);
      if (failedGen && failedGen.includes("{")) {
        console.warn(`[Agent: ${config.name}] Attempting recovery from failed generation...`);
        try {
          const firstBrace = failedGen.indexOf("{");
          const lastBrace = failedGen.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            let jsonStr = failedGen.substring(firstBrace, lastBrace + 1);
            
            // Apply custom regex fixes for common Groq structural syntax bugs
            jsonStr = jsonStr.replace(/\}\s*,\s*"heading"\s*:/g, '}, {"heading":');
            jsonStr = jsonStr.replace(/\}+\s*,\s*"metadata"\s*:/g, '}], "metadata":');
            
            jsonStr = jsonStr.replace(/\}\}\s*,\s*"type"\s*:\s*"(object|array)"/g, '}');
            const repaired = jsonrepair(jsonStr);
            const parsed = JSON.parse(repaired);
            if (typeof parsed.sections === "string") {
              try {
                parsed.sections = JSON.parse(parsed.sections);
              } catch {
                parsed.sections = [];
              }
            }
            sanitizeParsedOutput(parsed);
            const validated = agentOutputSchema.parse(parsed);
            
            return {
              agentId: config.id,
              status: "completed",
              title: validated.title,
              summary: validated.summary,
              sections: validated.sections,
              metadata: validated.metadata,
              startedAt,
              completedAt: new Date().toISOString(),
            };
          }
        } catch (recoveryError) {
          console.error(`[Agent: ${config.name}] Recovery failed:`, recoveryError);
        }
      }
      console.error(`[Agent: ${config.name}] Error:`, error);
      return createErrorOutput(config, startedAt, error);
    }
  }
  return createErrorOutput(config, startedAt, new Error("All Groq API keys exhausted or failed."));
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT WITH TOOLS — LangGraph ReAct agent + Tavily web search
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs an AI agent WITH tools (Advisor, Market Research, Marketing).
 *
 * @param config   - The agent's configuration (from config.ts)
 * @param input    - The founder's startup idea
 * @param context  - Optional: outputs from previous agents
 * @returns        - The structured AgentOutput
 */
export async function runAgentWithTools(
  config: AgentConfig,
  input: StartupInput,
  context?: string,
  onProgress?: AgentProgressCallback
): Promise<AgentOutput> {
  const startedAt = new Date().toISOString();

  const tavilyKey = (process.env as any).TAVILY_API_KEY;
  if (isTavilyOffline || !tavilyKey || tavilyKey.includes("placeholder")) {
    console.warn(`[runAgentWithTools] Tavily is offline or API key is missing. Bypassing ReAct loop and calling runAgent directly for ${config.name}`);
    onProgress?.("Web search is currently offline. Utilizing internal knowledge base...");
    return runAgent(config, input, context, onProgress);
  }

  const maxAttempts = Math.max(5, groqKeys.length);
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apiKey = getNextKey();
      const userPrompt = buildPrompt(input, context);

      const model = new ChatGroq({
        model: config.model,
        apiKey: apiKey,
        temperature: 0.2,
        maxTokens: config.maxTokens,
      });

      onProgress?.("Initiating web research and market analysis...");

      const searchTool = new TavilySearch({
        maxResults: 5,
        searchDepth: "advanced",
      });

      // Override the tool schema to only expose the query parameter.
      // This prevents the LLM from generating invalid parameters (like topic: "health")
      // which cause Groq to reject the tool call with a 400 error.
      searchTool.schema = z.object({
        query: z.string().describe("The search query to look up information for."),
      }) as any;

      const originalCall = searchTool._call.bind(searchTool);
      (searchTool as any)._call = async (input: any, runManager?: any) => {
        const query = typeof input === "string" ? input : (input?.query || "");
        onProgress?.(`Searching: "${query}"`);
        try {
          const res = await originalCall(input, runManager);
          const resStr = typeof res === "string" ? res : JSON.stringify(res || {});
          const resAny = res as any;
          const isErrorResponse = 
            resStr.includes("Unauthorized") || 
            resStr.includes("401") || 
            resStr.includes("API key") || 
            (resAny && typeof resAny === "object" && (resAny.status === 401 || resAny.status === 403 || resAny.ok === false));
          if (isErrorResponse) {
            console.warn("[TavilySearch] Unauthorized response detected. Marking Tavily as offline.");
            isTavilyOffline = true;
          }
          return res;
        } catch (err: any) {
          console.warn(`[TavilySearch Error] Gracefully falling back:`, err.message || err);
          isTavilyOffline = true;
          return "Search is currently offline, rate-limited, or unauthorized. DO NOT attempt to search again. Please proceed and answer based on your internal knowledge.";
        }
      };

      const tools = [searchTool];

      const agent = createReactAgent({
        llm: model,
        tools,
        responseFormat: agentOutputSchema,
      });

      const agentResult = await agent.invoke({
        messages: [
          new SystemMessage(config.systemPrompt),
          new HumanMessage(userPrompt),
        ],
      });

      const result = (agentResult as any).structuredResponse;

      return {
        agentId: config.id,
        status: "completed",
        title: result.title,
        summary: result.summary,
        sections: result.sections,
        metadata: result.metadata,
        startedAt,
        completedAt: new Date().toISOString(),
      };
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
        console.warn(`[Agent: ${config.name}] API key failed in tool agent (Status: ${error?.status || 'unknown'}, Msg: ${errorMsg.substring(0, 100)}). Retrying (attempt ${attempt}/${maxAttempts})...`);
        continue;
      }

      const failedGen = getFailedGeneration(error);
      if (failedGen && failedGen.includes("{")) {
        console.warn(`[Agent: ${config.name}] Attempting recovery from failed generation in tool agent...`);
        try {
          const firstBrace = failedGen.indexOf("{");
          const lastBrace = failedGen.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            let jsonStr = failedGen.substring(firstBrace, lastBrace + 1);
            
            // Apply custom regex fixes for common Groq structural syntax bugs
            jsonStr = jsonStr.replace(/\}\s*,\s*"heading"\s*:/g, '}, {"heading":');
            jsonStr = jsonStr.replace(/\}+\s*,\s*"metadata"\s*:/g, '}], "metadata":');
            
            jsonStr = jsonStr.replace(/\}\}\s*,\s*"type"\s*:\s*"(object|array)"/g, '}');
            const repaired = jsonrepair(jsonStr);
            const parsed = JSON.parse(repaired);
            if (typeof parsed.sections === "string") {
              try {
                parsed.sections = JSON.parse(parsed.sections);
              } catch {
                parsed.sections = [];
              }
            }
            sanitizeParsedOutput(parsed);
            const validated = agentOutputSchema.parse(parsed);
            
            return {
              agentId: config.id,
              status: "completed",
              title: validated.title,
              summary: validated.summary,
              sections: validated.sections,
              metadata: validated.metadata,
              startedAt,
              completedAt: new Date().toISOString(),
            };
          }
        } catch (recoveryError) {
          console.error(`[Agent: ${config.name}] Recovery failed in tool agent:`, recoveryError);
        }
      }
      console.error(`[Agent: ${config.name}] Error (with tools):`, error);
      return createErrorOutput(config, startedAt, error);
    }
  }
  return createErrorOutput(config, startedAt, new Error("All Groq API keys exhausted or failed in tool agent."));
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
): AgentOutput {
  return {
    agentId: config.id,
    status: "error",
    title: `${config.name} — Error`,
    summary: "This agent encountered an error during execution.",
    sections: [],
    metadata: {},
    startedAt,
    completedAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : "Unknown error occurred",
  };
}
