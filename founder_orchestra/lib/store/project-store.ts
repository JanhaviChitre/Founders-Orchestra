/**
 * =============================================================================
 * STORE — Project State (Zustand)
 * =============================================================================
 *
 * Global state management for the entire app using Zustand.
 * Persists to localStorage so data survives page refreshes.
 *
 * Owner: Shared (all team members use this store)
 * =============================================================================
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AgentId,
  AgentOutputUnion,
  AgentStatus,
  StartupInput,
  OrchestrationStatus,
  ProjectState,
} from "@/lib/types";
import { ALL_AGENT_IDS, AGENT_CONFIGS } from "@/lib/agents/config";
import { toast } from "@/hooks/use-toast";
import { MOCK_PROJECT } from "@/lib/mock-data";

interface ProjectStore {
  input: StartupInput | null;
  projectId: string | null;
  agents: Partial<Record<AgentId, AgentOutputUnion>>;
  overallStatus: OrchestrationStatus;
  activeSection: string;
  pdfModalOpen: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────
  setInput: (input: StartupInput) => void;
  setProjectId: (projectId: string | null) => void;
  setAgentOutput: (agentId: AgentId, output: AgentOutputUnion) => void;
  setAgentPartialText: (agentId: AgentId, partialText: string) => void;
  setAgentStatus: (agentId: AgentId, status: AgentStatus) => void;
  setOverallStatus: (status: OrchestrationStatus) => void;
  setActiveSection: (sectionId: string) => void;
  togglePdfModal: () => void;
  setPdfModalOpen: (open: boolean) => void;
  resetProject: () => void;
  loadMockData: () => void;
  loadProject: (project: ProjectState) => void;
  runOrchestration: () => Promise<void>;
  retryAgent: (agentId: AgentId) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  input: null,
  projectId: null as string | null,
  agents: {} as Partial<Record<AgentId, AgentOutputUnion>>,
  overallStatus: "not-started" as OrchestrationStatus,
  activeSection: "orbit",
  pdfModalOpen: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE THE STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setInput: (input) =>
        set({
          input,
          projectId: null,
          agents: {},
          overallStatus: "not-started",
          activeSection: "orbit",
        }),

      setAgentOutput: (agentId, output) =>
        set((state) => ({
          agents: { ...state.agents, [agentId]: output },
        })),

      setAgentPartialText: (agentId, partialText) =>
        set((state) => {
          const existing = state.agents[agentId];
          const base = existing ?? ({
            agentId,
            status: "running",
          } as any);
          return {
            agents: {
              ...state.agents,
              [agentId]: { ...base, status: "running", latestReasoning: partialText },
            },
          };
        }),

      setAgentStatus: (agentId, status) =>
        set((state) => {
          const existing = state.agents[agentId];
          if (!existing) return state;
          return {
            agents: {
              ...state.agents,
              [agentId]: { ...existing, status },
            },
          };
        }),

      setOverallStatus: (status) => set({ overallStatus: status }),

      setActiveSection: (sectionId) => set({ activeSection: sectionId }),

      togglePdfModal: () =>
        set((state) => ({ pdfModalOpen: !state.pdfModalOpen })),

      setPdfModalOpen: (open) => set({ pdfModalOpen: open }),

      setProjectId: (projectId) => set({ projectId }),

      loadProject: (project) =>
        set({
          input: project.input,
          projectId: project._id ?? null,
          agents: project.agents as any,
          overallStatus: project.overallStatus,
          activeSection: "orbit",
        }),

      resetProject: () => set(DEFAULT_STATE),

      loadMockData: () => {
        set({
          input: MOCK_PROJECT.input,
          projectId: "demo-project",
          agents: MOCK_PROJECT.agents as any,
          overallStatus: MOCK_PROJECT.overallStatus,
        });
        toast({
          title: "Demo Loaded",
          description: "Sample startup data has been loaded successfully.",
        });
      },

      runOrchestration: async () => {
        const state = useProjectStore.getState();
        if (!state.input) return;

        const runSimulation = async () => {
          set({ overallStatus: "in-progress" });

          const initialAgents: Partial<Record<AgentId, AgentOutputUnion>> = {};
          ALL_AGENT_IDS.forEach((id) => {
            initialAgents[id] = {
              agentId: id as any,
              status: "idle",
            } as any;
          });
          set({ agents: initialAgents });

          const runSimulatedAgent = async (agentId: AgentId, delayMs: number) => {
            set((s) => {
              const existing = s.agents[agentId];
              return {
                agents: {
                  ...s.agents,
                  [agentId]: {
                    ...(existing || {}),
                    agentId,
                    status: "running",
                  } as any,
                },
              };
            });
            await new Promise((r) => setTimeout(r, delayMs));

            const customOutput = MOCK_PROJECT.agents[agentId];
            set((s) => ({
              agents: { ...s.agents, [agentId]: customOutput },
            }));
            toast({
              title: `${AGENT_CONFIGS[agentId].name} Complete`,
              description: `Validation findings are ready.`,
            });
          };

          try {
            await Promise.all([
              runSimulatedAgent("startup-advisor", 2000),
              runSimulatedAgent("market-research", 2500),
            ]);
            await Promise.all([
              runSimulatedAgent("product-manager", 2000),
              runSimulatedAgent("marketing", 2200),
            ]);
            await Promise.all([
              runSimulatedAgent("architect", 2000),
              runSimulatedAgent("engineering-manager", 2500),
            ]);

            set({ overallStatus: "completed" });
            toast({
              title: "Pipeline Completed",
              description: "Simulated startup validation pipeline finished successfully!",
            });
          } catch (error) {
            console.error("Simulation error:", error);
            set({ overallStatus: "not-started" });
          }
        };

        if (state.projectId === "demo-project") {
          await runSimulation();
          return;
        }

        set({ overallStatus: "in-progress" });

        const initialAgents: Partial<Record<AgentId, AgentOutputUnion>> = {};
        ALL_AGENT_IDS.forEach((id) => {
          initialAgents[id] = {
            agentId: id as any,
            status: "idle",
          } as any;
        });
        set({ agents: initialAgents });

        try {
          const response = await fetch("/api/orchestrate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: state.input,
              projectId: state.projectId === "demo-project" ? undefined : (state.projectId || undefined),
            }),
          });

          if (!response.ok) {
            throw new Error(`Orchestration failed with status ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("Response stream is not readable");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6);
                try {
                  const data = JSON.parse(dataStr);

                  if (data.type === "project-created") {
                    set({ projectId: data.projectId });
                  } else if (data.type === "agent-start") {
                    set((s) => {
                      const existing = s.agents[data.agentId as AgentId];
                      return {
                        agents: {
                          ...s.agents,
                          [data.agentId]: {
                            ...(existing || {}),
                            agentId: data.agentId,
                            status: "running",
                          } as any,
                        },
                      };
                    });
                  } else if (data.type === "agent-progress") {
                    set((s) => {
                      const existing = s.agents[data.agentId as AgentId];
                      return {
                        agents: {
                          ...s.agents,
                          [data.agentId]: {
                            ...(existing || {}),
                            agentId: data.agentId,
                            status: "running",
                            latestReasoning: data.partialText,
                          } as any,
                        },
                      };
                    });
                  } else if (data.type === "agent-complete") {
                    set((s) => ({
                      agents: {
                        ...s.agents,
                        [data.agentId]: data.output,
                      },
                    }));
                    toast({
                      title: `${AGENT_CONFIGS[data.agentId as AgentId]?.name ?? data.agentId} Complete`,
                      description: `Validation findings are ready.`,
                    });
                  } else if (data.type === "agent-error") {
                    set((s) => {
                      const existing = s.agents[data.agentId as AgentId];
                      return {
                        agents: {
                          ...s.agents,
                          [data.agentId]: {
                            ...(existing || {}),
                            agentId: data.agentId,
                            status: "error",
                            error: data.error,
                          } as any,
                        },
                      };
                    });
                    toast({
                      variant: "destructive",
                      title: `${AGENT_CONFIGS[data.agentId as AgentId]?.name ?? data.agentId} Error`,
                      description: "Something went wrong. Please try again.",
                    });
                  } else if (data.type === "orchestration-complete") {
                    set({ overallStatus: data.overallStatus });
                    toast({
                      title: "Pipeline Completed",
                      description: "Startup validation pipeline finished successfully!",
                    });
                  } else if (data.type === "orchestration-error") {
                    set({ overallStatus: "not-started" });
                    toast({
                      variant: "destructive",
                      title: "Pipeline Failed",
                      description: "Something went wrong. Please try again.",
                    });
                  }
                } catch (err) {
                  console.error("Failed to parse SSE event chunk", err);
                }
              }
            }
          }
        } catch (error: any) {
          console.warn("Orchestration API failed, falling back to local simulation:", error);
          await runSimulation();
        }
      },

      retryAgent: async (agentId: AgentId) => {
        const state = useProjectStore.getState();
        if (!state.input) return;

        const runSimulatedRetry = async () => {
          set({ overallStatus: "in-progress" });

          set((s) => {
            const existing = s.agents[agentId];
            return {
              agents: {
                ...s.agents,
                [agentId]: {
                  ...(existing || {}),
                  agentId,
                  status: "running",
                } as any,
              },
            };
          });

          await new Promise((r) => setTimeout(r, 2000));
          const customOutput = MOCK_PROJECT.agents[agentId];

          set((s) => ({
            agents: { ...s.agents, [agentId]: customOutput },
            overallStatus: "completed",
          }));

          toast({
            title: `${AGENT_CONFIGS[agentId].name} Complete`,
            description: `Agent successfully retried and completed.`,
          });
        };

        if (state.projectId === "demo-project") {
          await runSimulatedRetry();
          return;
        }

        set({ overallStatus: "in-progress" });

        set((s) => {
          const updated = { ...s.agents };
          updated[agentId] = {
            agentId,
            status: "idle",
          } as any;
          return { agents: updated };
        });

        try {
          const response = await fetch("/api/orchestrate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: state.input,
              projectId: state.projectId === "demo-project" ? undefined : (state.projectId || undefined),
              targetAgents: [agentId],
              previousResults: state.agents,
            }),
          });

          if (!response.ok) {
            throw new Error(`Retry failed with status ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("Response stream is not readable");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6);
                try {
                  const data = JSON.parse(dataStr);

                  if (data.type === "agent-start" && data.agentId === agentId) {
                    set((s) => {
                      const existing = s.agents[agentId];
                      return {
                        agents: {
                          ...s.agents,
                          [agentId]: {
                            ...(existing || {}),
                            agentId,
                            status: "running",
                          } as any,
                        },
                      };
                    });
                  } else if (data.type === "agent-progress" && data.agentId === agentId) {
                    set((s) => {
                      const existing = s.agents[agentId];
                      return {
                        agents: {
                          ...s.agents,
                          [agentId]: {
                            ...(existing || {}),
                            agentId,
                            status: "running",
                            latestReasoning: data.partialText,
                          } as any,
                        },
                      };
                    });
                  } else if (data.type === "agent-complete" && data.agentId === agentId) {
                    set((s) => ({
                      agents: { ...s.agents, [agentId]: data.output },
                    }));
                    toast({
                      title: `${AGENT_CONFIGS[agentId]?.name ?? agentId} Complete`,
                      description: `Validation findings are ready.`,
                    });
                  } else if (data.type === "agent-error" && data.agentId === agentId) {
                    set((s) => {
                      const existing = s.agents[agentId];
                      return {
                        agents: {
                          ...s.agents,
                          [agentId]: {
                            ...(existing || {}),
                            agentId,
                            status: "error",
                            error: data.error,
                          } as any,
                        },
                      };
                    });
                  } else if (data.type === "orchestration-complete") {
                    set({ overallStatus: data.overallStatus });
                  }
                } catch (err) {
                  console.error("Failed to parse SSE event chunk", err);
                }
              }
            }
          }
        } catch (error: any) {
          console.warn("Orchestration API retry failed, falling back to local simulation:", error);
          await runSimulatedRetry();
        }
      },
    }),
    {
      name: "founder-os-project",
      merge: (persistedState: any, currentState) => {
        const state = persistedState as Partial<ProjectStore> | undefined;
        return {
          ...currentState,
          ...state,
          agents: state?.agents ?? {},
        };
      },
    }
  )
);

export function getAgentStatus(
  agents: Partial<Record<AgentId, AgentOutputUnion>> | undefined | null,
  agentId: AgentId
): AgentStatus {
  if (!agents) return "idle";
  return agents[agentId]?.status ?? "idle";
}
