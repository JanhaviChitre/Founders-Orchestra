/**
 * =============================================================================
 * PDF REPORT TEMPLATE
 * =============================================================================
 *
 * Visual layout of the exported PDF report rendering directly from discrete schemas.
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ProjectState } from "@/lib/types";
import { AGENT_CONFIGS, ALL_AGENT_IDS } from "@/lib/agents/config";
import type {
  StartupAdvisorOutput,
  MarketResearchOutput,
  ProductManagerOutput,
  MarketingOutput,
  ArchitectOutput,
  EngineeringManagerOutput,
} from "@/lib/agents/schemas";

const COLORS = {
  primary: "#6366f1",
  primaryLight: "#e0e1ff",
  dark: "#1a1a1a",
  body: "#374151",
  muted: "#6b7280",
  light: "#9ca3af",
  bg: "#f9fafb",
  border: "#e5e7eb",
  white: "#ffffff",
  emerald: "#10b981",
  sky: "#0ea5e9",
  indigo: "#6366f1",
  amber: "#f59e0b",
  purple: "#a855f7",
  rose: "#f43f5e",
};

function getAgentColor(colorName: string): string {
  return (COLORS as Record<string, string>)[colorName] ?? COLORS.primary;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 45,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: COLORS.body,
  },
  coverPage: {
    paddingHorizontal: 50,
    paddingVertical: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  coverBanner: {
    width: "100%",
    height: 8,
    backgroundColor: COLORS.primary,
    marginBottom: 60,
    borderRadius: 4,
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    marginBottom: 10,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 6,
    textAlign: "center",
  },
  coverTagline: {
    fontSize: 11,
    color: COLORS.light,
    textAlign: "center",
    marginBottom: 50,
  },
  coverInfoBox: {
    width: "100%",
    backgroundColor: COLORS.bg,
    borderRadius: 6,
    padding: 20,
    marginBottom: 16,
  },
  coverInfoLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  coverInfoValue: {
    fontSize: 11,
    lineHeight: 1.7,
    color: COLORS.body,
  },
  coverMeta: {
    fontSize: 9,
    color: COLORS.light,
    textAlign: "center",
    marginTop: 40,
  },
  sectionAccent: {
    height: 4,
    borderRadius: 2,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: COLORS.dark,
  },
  sectionDescription: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: COLORS.bg,
    borderLeftWidth: 3,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: COLORS.dark,
  },
  subsectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    marginTop: 14,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 6,
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.5,
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 8,
    color: COLORS.light,
  },
  footerRight: {
    fontSize: 8,
    color: COLORS.light,
  },
});

function PageFooter({ startupName }: { startupName: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerLeft}>
        {startupName} — Founders Orchestra Report
      </Text>
      <Text
        style={styles.footerRight}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

interface ReportDocumentProps {
  project: ProjectState;
}

export function ReportDocument({ project }: ReportDocumentProps) {
  const { input, agents } = project;
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`${input.startupName} — Founders Orchestra Report`}
      author="Founders Orchestra"
      subject="AI-Powered Startup Analysis"
    >
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverBanner} />
        <Text style={styles.coverTitle}>{input.startupName}</Text>
        <Text style={styles.coverSubtitle}>
          AI-Powered Startup Analysis Report
        </Text>
        <Text style={styles.coverTagline}>
          Generated by Founders Orchestra on {dateStr}
        </Text>

        <View style={styles.coverInfoBox}>
          <Text style={styles.coverInfoLabel}>Startup Idea</Text>
          <Text style={styles.coverInfoValue}>{input.idea}</Text>
        </View>

        {(input.industry || input.targetAudience || input.budget) && (
          <View style={styles.coverInfoBox}>
            {input.industry && (
              <>
                <Text style={styles.coverInfoLabel}>Industry</Text>
                <Text style={styles.coverInfoValue}>{input.industry}</Text>
              </>
            )}
            {input.targetAudience && (
              <>
                <Text
                  style={{
                    ...styles.coverInfoLabel,
                    marginTop: input.industry ? 10 : 0,
                  }}
                >
                  Target Audience
                </Text>
                <Text style={styles.coverInfoValue}>
                  {input.targetAudience}
                </Text>
              </>
            )}
          </View>
        )}

        <Text style={styles.coverMeta}>
          This report was generated by AI agents and is intended as a starting
          point for further research and validation.
        </Text>
        <PageFooter startupName={input.startupName} />
      </Page>

      {/* Discrete Agent Output Pages */}
      {ALL_AGENT_IDS.map((agentId) => {
        const output = (agents as any)[agentId];
        if (!output || (output as any).status !== "completed") return null;

        const config = AGENT_CONFIGS[agentId];
        if (!config) return null;
        const accentColor = getAgentColor(config.color);

        return (
          <Page key={agentId} size="A4" style={styles.page}>
            <View style={[styles.sectionAccent, { backgroundColor: accentColor }]} />
            <Text style={styles.sectionTitle}>{config.name}</Text>
            <Text style={styles.sectionDescription}>{config.description}</Text>

            {/* 1. Startup Advisor */}
            {agentId === "startup-advisor" && (
              <View>
                <View style={[styles.summaryBox, { borderLeftColor: accentColor }]}>
                  <Text style={styles.summaryText}>{(output as StartupAdvisorOutput).validation_summary}</Text>
                </View>
                <Text style={styles.subsectionTitle}>PMF Score: {(output as StartupAdvisorOutput).pmf_score?.score}/100 ({(output as StartupAdvisorOutput).pmf_score?.label})</Text>
                <Text style={styles.paragraph}>Signal: {(output as StartupAdvisorOutput).pmf_score?.signal}</Text>
                <Text style={styles.subsectionTitle}>Market Sizing (TAM)</Text>
                <Text style={styles.paragraph}>{(output as StartupAdvisorOutput).tam?.value} — {(output as StartupAdvisorOutput).tam?.description}</Text>
                {((output as StartupAdvisorOutput).sections || []).map((sec, i) => (
                  <View key={i} style={{ marginTop: 6 }}>
                    <Text style={styles.subsectionTitle}>{sec.heading}</Text>
                    <Text style={styles.paragraph}>{sec.content}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 2. Market Research */}
            {agentId === "market-research" && (
              <View>
                <View style={[styles.summaryBox, { borderLeftColor: accentColor }]}>
                  <Text style={styles.summaryText}>{(output as MarketResearchOutput).summary}</Text>
                </View>
                <Text style={styles.subsectionTitle}>Market Sizing</Text>
                <Text style={styles.paragraph}>TAM: {(output as MarketResearchOutput).market_sizing?.tam?.value} | SAM: {(output as MarketResearchOutput).market_sizing?.sam?.value} | SOM: {(output as MarketResearchOutput).market_sizing?.som?.value}</Text>
                <Text style={styles.paragraph}>{(output as MarketResearchOutput).market_sizing?.insight}</Text>

                <Text style={styles.subsectionTitle}>Competitors ({((output as MarketResearchOutput).competitors || []).length})</Text>
                {((output as MarketResearchOutput).competitors || []).map((comp, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={{ color: accentColor, marginRight: 6 }}>•</Text>
                    <Text style={styles.bulletText}><Text style={{ fontFamily: "Helvetica-Bold" }}>{comp.name}</Text> ({comp.tag}) — {comp.price_per_month}/mo | Threat: {comp.threat_level}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 3. Product Manager */}
            {agentId === "product-manager" && (
              <View>
                <View style={[styles.summaryBox, { borderLeftColor: accentColor }]}>
                  <Text style={styles.summaryText}>{(output as ProductManagerOutput).summary}</Text>
                </View>
                <Text style={styles.subsectionTitle}>Product Vision</Text>
                <Text style={styles.paragraph}>{(output as ProductManagerOutput).product_vision}</Text>

                <Text style={styles.subsectionTitle}>User Stories ({((output as ProductManagerOutput).user_stories || []).length})</Text>
                {((output as ProductManagerOutput).user_stories || []).map((story, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={{ color: accentColor, marginRight: 6 }}>•</Text>
                    <Text style={styles.bulletText}><Text style={{ fontFamily: "Helvetica-Bold" }}>{story.id}:</Text> {story.text} [{story.priority}]</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 4. Marketing */}
            {agentId === "marketing" && (
              <View>
                <View style={[styles.summaryBox, { borderLeftColor: accentColor }]}>
                  <Text style={styles.summaryText}>{(output as MarketingOutput).summary}</Text>
                </View>
                <Text style={styles.subsectionTitle}>Landing Page Headline</Text>
                <Text style={styles.paragraph}>{(output as MarketingOutput).landing_page?.headline}</Text>
                <Text style={styles.paragraph}>{(output as MarketingOutput).landing_page?.subheadline}</Text>

                <Text style={styles.subsectionTitle}>LinkedIn Launch Post</Text>
                <Text style={styles.paragraph}>{(output as MarketingOutput).linkedin_post?.content}</Text>
              </View>
            )}

            {/* 5. Architect */}
            {agentId === "architect" && (
              <View>
                <View style={[styles.summaryBox, { borderLeftColor: accentColor }]}>
                  <Text style={styles.summaryText}>{(output as ArchitectOutput).summary}</Text>
                </View>
                <Text style={styles.subsectionTitle}>Database Schema</Text>
                {((output as ArchitectOutput).database_schema || []).map((tbl, i) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11 }}>Table: {tbl.table}</Text>
                    {(tbl.columns || []).map((col, ci) => (
                      <Text key={ci} style={{ fontSize: 9.5, paddingLeft: 10 }}>- {col.name} ({col.type}) {col.is_pk ? "[PK]" : ""}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* 6. Engineering Manager */}
            {agentId === "engineering-manager" && (
              <View>
                <View style={[styles.summaryBox, { borderLeftColor: accentColor }]}>
                  <Text style={styles.summaryText}>{(output as EngineeringManagerOutput).summary}</Text>
                </View>
                <Text style={styles.subsectionTitle}>GitHub Issues Backlog</Text>
                {((output as EngineeringManagerOutput).github_issues || []).map((issue, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={{ color: accentColor, marginRight: 6 }}>•</Text>
                    <Text style={styles.bulletText}><Text style={{ fontFamily: "Helvetica-Bold" }}>#{issue.number}:</Text> {issue.title} ({issue.story_points} SP) [{issue.priority}]</Text>
                  </View>
                ))}

                <Text style={styles.subsectionTitle}>
                  Sprint Execution Roadmap ({(output as EngineeringManagerOutput).sprint_plan?.duration_weeks || 2}-Week Sprint)
                </Text>

                {((output as EngineeringManagerOutput).sprint_plan?.phases && (output as EngineeringManagerOutput).sprint_plan.phases.length > 0) ? (
                  (output as EngineeringManagerOutput).sprint_plan.phases.slice(0, 3).map((phase, i) => (
                    <View key={i} style={{ marginTop: 8, marginBottom: 4 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10.5, color: COLORS.dark }}>
                        Phase {phase.phase_number || i + 1}: {phase.name} ({phase.duration_days || `Days ${i * 4 + 1} – ${i * 4 + 4}`})
                      </Text>
                      {(phase.tasks || []).map((task, ti) => (
                        <View key={ti} style={[styles.bulletRow, { paddingLeft: 10, marginTop: 2 }]}>
                          <Text style={{ color: accentColor, marginRight: 6 }}>-</Text>
                          <Text style={styles.bulletText}>{task}</Text>
                        </View>
                      ))}
                    </View>
                  ))
                ) : (
                  <View style={{ marginTop: 6 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10 }}>Phase 1: Architecture & Foundation (Days 1 – 4)</Text>
                    {((output as EngineeringManagerOutput).sprint_plan?.todo || []).map((t, i) => (
                      <View key={i} style={[styles.bulletRow, { paddingLeft: 10 }]}>
                        <Text style={{ color: accentColor, marginRight: 6 }}>-</Text>
                        <Text style={styles.bulletText}>{t}</Text>
                      </View>
                    ))}

                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, marginTop: 4 }}>Phase 2: Core Engineering (Days 5 – 9)</Text>
                    {((output as EngineeringManagerOutput).sprint_plan?.in_progress || []).map((t, i) => (
                      <View key={i} style={[styles.bulletRow, { paddingLeft: 10 }]}>
                        <Text style={{ color: accentColor, marginRight: 6 }}>-</Text>
                        <Text style={styles.bulletText}>{t}</Text>
                      </View>
                    ))}

                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, marginTop: 4 }}>Phase 3: Integration & Release (Days 10 – 14)</Text>
                    {((output as EngineeringManagerOutput).sprint_plan?.done || []).map((t, i) => (
                      <View key={i} style={[styles.bulletRow, { paddingLeft: 10 }]}>
                        <Text style={{ color: accentColor, marginRight: 6 }}>-</Text>
                        <Text style={styles.bulletText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <PageFooter startupName={input.startupName} />
          </Page>
        );
      })}
    </Document>
  );
}
