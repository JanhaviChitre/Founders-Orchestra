/**
 * =============================================================================
 * PDF REPORT TEMPLATE
 * =============================================================================
 *
 * This file defines the visual layout of the exported PDF report.
 * It uses @react-pdf/renderer which provides React components
 * specifically for creating PDFs.
 *
 * IMPORTANT:
 * - This is NOT regular HTML/CSS — it uses its own primitives
 * - <View> = <div>, <Text> = <p>/<span>, <Page> = a page break
 * - Styles use a subset of CSS (no Tailwind here!)
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
import type { ProjectState, OutputSection } from "@/lib/types";
import { AGENT_CONFIGS, ALL_AGENT_IDS } from "@/lib/agents/config";

// ─────────────────────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  primary: "#6366f1",       // Indigo — brand accent
  primaryLight: "#e0e1ff",
  dark: "#1a1a1a",
  body: "#374151",
  muted: "#6b7280",
  light: "#9ca3af",
  bg: "#f9fafb",
  border: "#e5e7eb",
  white: "#ffffff",
  // Agent-specific accent colors (mapped from Tailwind names in config)
  emerald: "#10b981",
  sky: "#0ea5e9",
  indigo: "#6366f1",
  amber: "#f59e0b",
  purple: "#a855f7",
  rose: "#f43f5e",
};

/** Map a Tailwind color name from the agent config to a hex value */
function getAgentColor(colorName: string): string {
  return (COLORS as Record<string, string>)[colorName] ?? COLORS.primary;
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Page defaults ────────────────────────────────────────────────────
  page: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 45,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: COLORS.body,
  },

  // ── Cover page ───────────────────────────────────────────────────────
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

  // ── Agent section pages ──────────────────────────────────────────────
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
    padding: 12,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: 18,
  },
  summaryText: {
    fontSize: 10.5,
    fontStyle: "italic",
    color: COLORS.muted,
    lineHeight: 1.6,
  },
  subsectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    marginBottom: 6,
    marginTop: 14,
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.7,
    marginBottom: 6,
    color: COLORS.body,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 14,
    fontSize: 10.5,
    color: COLORS.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.65,
    color: COLORS.body,
  },

  // ── Table styles ─────────────────────────────────────────────────────
  table: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.dark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    color: COLORS.body,
  },

  // ── Metadata badge row ───────────────────────────────────────────────
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  metadataBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  metadataBadgeText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },

  // ── Footer ───────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 25,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — Parse markdown-style content into renderable elements
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders content text. Splits on newlines and detects bullet lines
 * (lines starting with `- ` or `• ` or numbered `1. ` patterns)
 * so they display as formatted lists rather than run-on paragraphs.
 */
function RenderContent({ content }: { content: string }) {
  const sanitized = sanitizeTruncatedContent(content);

  // Normalize inline numbered lists for user stories
  const normalized = sanitized
    .replace(/(\d+)\.\s+(?=As\s+a[n]?\s)/gi, '\n$1. ');

  // Normalize inline phase descriptions for roadmap
  const normalized2 = normalized
    .replace(/(Phase\s*\d+(?:\s*\([^)]*\))?|Q\d+(?:\s*\([^)]*\))?|\bMVP\b|\bGrowth\b|\bScale\b)\s*[:)]?\s*/gi, '\n$1: ')
    .replace(/\.\s+(Phase\s*\d+|Q\d+|\bMVP\b|\bGrowth\b|\bScale\b)/gi, '.\n$1');

  const lines = normalized2.split("\n").filter((l) => l.trim() !== "");

  return (
    <View>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Detect and strip headings: "### Title" or "## Title"
        const headingMatch = trimmed.match(/^(#{1,6})\s*(.+)/);
        if (headingMatch) {
          return (
            <Text key={i} style={[styles.subsectionTitle, { marginTop: 10 }]}>
              {headingMatch[2]}
            </Text>
          );
        }

        // Detect bullet points: "- text", "• text", "* text"
        const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
        if (bulletMatch) {
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                {stripMarkdownBold(bulletMatch[1])}
              </Text>
            </View>
          );
        }

        // Detect numbered lists: "1. text", "2) text"
        const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
        if (numberedMatch) {
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>{numberedMatch[1]}.</Text>
              <Text style={styles.bulletText}>
                {stripMarkdownBold(numberedMatch[2])}
              </Text>
            </View>
          );
        }

        // Regular paragraph
        return (
          <Text key={i} style={styles.paragraph}>
            {stripMarkdownBold(trimmed)}
          </Text>
        );
      })}
    </View>
  );
}

/**
 * Strip markdown bold markers (**text**) to plain text for PDF display.
 * @react-pdf/renderer doesn't support inline rich text mixing, so we
 * remove the markers to avoid showing raw asterisks.
 */
function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}

/**
 * Renders a table from the OutputSection's tableData if present.
 */
function RenderTable({ section }: { section: OutputSection }) {
  if (!section.tableData) return null;
  const { headers, rows } = section.tableData;

  return (
    <View style={styles.table}>
      {/* Header row */}
      <View style={styles.tableHeaderRow}>
        {headers.map((header, i) => (
          <Text key={i} style={styles.tableHeaderCell}>
            {header}
          </Text>
        ))}
      </View>
      {/* Data rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={[
          styles.tableRow,
          ri === rows.length - 1 ? { borderBottomWidth: 0 } : {},
        ]}>
          {row.map((cell, ci) => (
            <Text key={ci} style={styles.tableCell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITIZE TRUNCATED CONTENT
// ─────────────────────────────────────────────────────────────────────────────

function sanitizeTruncatedContent(text: string): string {
  if (!text) return "";
  
  let cleaned = text
    .replace(/\*\*(growth|scale|momentum|note|source)\s*:\*\*/gi, '')
    .replace(/\n?(growth|scale):\s*/gi, ' ');
  
  // Fix for Bug 3: remove any unclosed parenthesis at the end of a string
  cleaned = cleaned.replace(/\([^)]*$/, '').trim();
  
  cleaned = cleaned.replace(/[,;\-\s]+$/, "");

  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned = cleaned + ".";
  }

  return cleaned;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSING HELPERS — GitHub Issues & Sprint Plan
// ─────────────────────────────────────────────────────────────────────────────

function getGithubIssuesData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("issue")
  );
  if (!section) return undefined;

  const issues: any[] = [];
  let issueCounter = 1;

  // 1. Try to parse from section.data (structured format)
  if (section.data && Array.isArray(section.data) && section.data.length > 0) {
    section.data.forEach((item: any) => {
      if (item && item.name) {
        const title = item.name;
        const points = typeof item.value === "number" ? item.value : 5;

        const labels: any[] = [];
        if (title.toLowerCase().includes("auth") || title.toLowerCase().includes("jwt")) {
          labels.push({ text: "auth", variant: "auth" });
        }
        if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("model")) {
          labels.push({ text: "ai", variant: "ai" });
        }
        if (title.toLowerCase().includes("ui") || title.toLowerCase().includes("page")) {
          labels.push({ text: "ui", variant: "ui" });
        }
        if (labels.length === 0) {
          labels.push({ text: "feature", variant: "feat" });
        }
        labels.push({
          text: `P${issueCounter <= 2 ? 1 : issueCounter <= 4 ? 2 : 3}`,
          variant: `p${issueCounter <= 2 ? 1 : issueCounter <= 4 ? 2 : 3}`,
        });

        issues.push({
          number: `#${String(issueCounter).padStart(3, '0')}`,
          title,
          labels,
          storyPoints: points,
        });
        issueCounter++;
      }
    });
    if (issues.length > 0) return issues;
  }

  // 2. Fall back to parsing section.content lines (markdown format)
  const lines = section.content.split("\n");
  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.match(/^\d+[.)]/)) {
      const cleanText = trimmed.replace(/^[-•*\d.)\s]+/, "").replace(/\*\*/g, "");
      const spMatch = cleanText.match(/(?:\(|\[)\s*(\d+)\s*(?:sp|story|points?)\s*(?:\)|\])/i);
      const points = spMatch ? parseInt(spMatch[1]) : 5;
      const title = cleanText.replace(/(?:\(|\[)\s*\d+\s*(?:sp|story|points?)\s*(?:\)|\])/i, "").trim();

      const labels: any[] = [];
      if (title.toLowerCase().includes("auth") || title.toLowerCase().includes("jwt")) {
        labels.push({ text: "auth", variant: "auth" });
      }
      if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("model")) {
        labels.push({ text: "ai", variant: "ai" });
      }
      if (title.toLowerCase().includes("ui") || title.toLowerCase().includes("page")) {
        labels.push({ text: "ui", variant: "ui" });
      }
      if (labels.length === 0) {
        labels.push({ text: "feature", variant: "feat" });
      }
      labels.push({
        text: `P${issueCounter <= 2 ? 1 : issueCounter <= 4 ? 2 : 3}`,
        variant: `p${issueCounter <= 2 ? 1 : issueCounter <= 4 ? 2 : 3}`,
      });

      issues.push({
        number: `#${String(issueCounter).padStart(3, '0')}`,
        title,
        labels,
        storyPoints: points,
      });
      issueCounter++;
    }
  });

  return issues.length > 0 ? issues : undefined;
}

function getSprintCardsData(agentOutput: any, issues: any[] | undefined): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;

  // Check if there are separate sections for Sprint Plan columns containing data lists
  const sprintSections = agentOutput.sections.filter((s: any) => {
    const heading = s.heading.toLowerCase();
    const content = s.content.toLowerCase();
    return heading.includes("sprint") || heading.includes("todo") || heading.includes("todo") || content.includes("to do") || content.includes("in progress") || content.includes("done");
  });

  const cards: any[] = [];
  let hasDataSprint = false;

  sprintSections.forEach((sec: any) => {
    // If the section has data list, and the content/heading indicates a column
    const txt = (sec.content + " " + sec.heading).toLowerCase();
    let col: "todo" | "inprog" | "done" | null = null;
    if (txt.includes("to do") || txt.includes("todo")) col = "todo";
    else if (txt.includes("in progress") || txt.includes("inprog")) col = "inprog";
    else if (txt.includes("done")) col = "done";

    if (col && sec.data && Array.isArray(sec.data) && sec.data.length > 0) {
      hasDataSprint = true;
      sec.data.forEach((item: any) => {
        if (item && item.name) {
          const matchedIssue = issues?.find(
            (issue) => issue.title.toLowerCase().trim() === item.name.toLowerCase().trim()
          );
          cards.push({
            title: item.name,
            points: typeof item.value === "number" ? item.value : 5,
            linkedId: matchedIssue?.number || "",
            column: col,
          });
        }
      });
    }
  });

  if (hasDataSprint && cards.length > 0) {
    return cards;
  }

  // Fallback: distribute issues dynamically
  if (!issues || issues.length === 0) return undefined;
  return issues.map((issue, idx) => ({
    title: issue.title,
    points: issue.storyPoints,
    linkedId: issue.number,
    column: idx < 2 ? "done" : idx < 4 ? "inprog" : "todo",
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — Engineering Manager Section PDF Renderer
// ─────────────────────────────────────────────────────────────────────────────

function RenderEngineeringSection({ output, sections }: { output: any, sections: any[] }) {
  const issues = getGithubIssuesData(output);
  const sprintCards = getSprintCardsData(output, issues);

  if (!issues || issues.length === 0) {
    return (
      <View>
        {sections.map((section: any, idx: number) => {
          const cleanHeading = section.heading.replace(/^(#{1,6})\s*/, "");
          return (
            <View key={idx} wrap={true}>
              <Text style={styles.subsectionTitle}>
                {cleanHeading}
              </Text>
              <RenderContent content={section.content} />
              <RenderTable section={section} />
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View>
      {/* ── Issues Subsection ────────────────────────────────────────── */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.subsectionTitle}>GitHub Issues</Text>
        {issues.map((issue, i) => (
          <View key={i} style={[styles.bulletRow, { marginBottom: 6 }]}>
            <Text style={{ fontSize: 10.5, fontFamily: "Helvetica-Bold", color: COLORS.primary, width: 35, flexGrow: 0 }}>
              {issue.number}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10.5, lineHeight: 1.5, color: COLORS.dark }}>
                {issue.title} <Text style={{ color: COLORS.muted }}>({issue.storyPoints} SP)</Text>
              </Text>
              <View style={{ flexDirection: "row", gap: 4, marginTop: 2 }}>
                {issue.labels.map((lbl: any, li: number) => (
                  <View key={li} style={{
                    backgroundColor: COLORS.primaryLight,
                    borderRadius: 3,
                    paddingVertical: 1,
                    paddingHorizontal: 4,
                  }}>
                    <Text style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: COLORS.primary,
                    }}>
                      {lbl.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* ── Sprint Plan Subsection ───────────────────────────────────── */}
      {sprintCards && sprintCards.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <Text style={styles.subsectionTitle}>Sprint Plan</Text>
          {["todo", "inprog", "done"].map((col) => {
            const colTitle = col === "todo" ? "To Do" : col === "inprog" ? "In Progress" : "Done";
            const colColor = col === "todo" ? COLORS.light : col === "inprog" ? COLORS.amber : COLORS.emerald;
            const items = sprintCards.filter((c) => c.column === col);
            if (items.length === 0) return null;
            return (
              <View key={col} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: colColor, marginBottom: 4 }}>
                  {colTitle}
                </Text>
                {items.map((item, ii) => (
                  <View key={ii} style={[styles.bulletRow, { paddingLeft: 12, marginBottom: 3 }]}>
                    <Text style={{ color: colColor, marginRight: 6 }}>•</Text>
                    <Text style={styles.bulletText}>
                      {item.title} <Text style={{ color: COLORS.muted, fontSize: 9 }}>({item.points} SP - {item.linkedId})</Text>
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE FOOTER (reusable)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// REPORT DOCUMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

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
      {/* ── Cover Page ──────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.coverPage}>
        {/* Accent banner at top */}
        <View style={styles.coverBanner} />

        <Text style={styles.coverTitle}>{input.startupName}</Text>
        <Text style={styles.coverSubtitle}>
          AI-Powered Startup Analysis Report
        </Text>
        <Text style={styles.coverTagline}>
          Generated by Founders Orchestra on {dateStr}
        </Text>

        {/* Startup idea details */}
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
                <Text style={{
                  ...styles.coverInfoLabel,
                  marginTop: input.industry ? 10 : 0,
                }}>Target Audience</Text>
                <Text style={styles.coverInfoValue}>
                  {input.targetAudience}
                </Text>
              </>
            )}
            {input.budget && (
              <>
                <Text style={{
                  ...styles.coverInfoLabel,
                  marginTop: (input.industry || input.targetAudience) ? 10 : 0,
                }}>Budget</Text>
                <Text style={styles.coverInfoValue}>{input.budget}</Text>
              </>
            )}
          </View>
        )}

        {input.additionalContext && (
          <View style={styles.coverInfoBox}>
            <Text style={styles.coverInfoLabel}>Additional Context</Text>
            <Text style={styles.coverInfoValue}>
              {input.additionalContext}
            </Text>
          </View>
        )}

        <Text style={styles.coverMeta}>
          This report was generated by AI agents and is intended as a starting
          point for further research and validation.
        </Text>

        {/* Footer on cover page */}
        <PageFooter startupName={input.startupName} />
      </Page>

      {/* ── Agent Output Pages ──────────────────────────────────────────── */}
      {ALL_AGENT_IDS.map((agentId) => {
        const output = agents[agentId];
        // Only include completed agents that have content
        if (!output || output.status !== "completed") return null;

        // Bug 2: Deduplicate sections by heading
        const seen = new Set<string>();
        const uniqueSections = (output.sections || []).filter((s: any) => {
          const key = s.heading.toLowerCase().trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Bug 3: Marketing Agent filter
        let sectionsToRender = uniqueSections;
        if (agentId === "marketing") {
          const hasLandingOrSocial = uniqueSections.some((s) => {
            const h = s.heading.toLowerCase();
            return h.includes("landing") || h.includes("linkedin") || h.includes("social");
          });

          if (hasLandingOrSocial) {
            sectionsToRender = uniqueSections.filter((s) => {
              const h = s.heading.toLowerCase();
              return h.includes("landing") || h.includes("linkedin") || h.includes("social");
            });
          } else {
            const hasHeroCopyCampaign = uniqueSections.some((s) => {
              const h = s.heading.toLowerCase();
              return h.includes("hero") || h.includes("copy") || h.includes("campaign");
            });
            if (hasHeroCopyCampaign) {
              sectionsToRender = uniqueSections.filter((s) => {
                const h = s.heading.toLowerCase();
                return h.includes("hero") || h.includes("copy") || h.includes("campaign");
              });
            }
          }
        }

        const config = AGENT_CONFIGS[agentId];
        if (!config) return null;

        const accentColor = getAgentColor(config.color);

        return (
          <Page key={agentId} size="A4" style={styles.page}>
            {/* Color accent bar */}
            <View
              style={[
                styles.sectionAccent,
                { backgroundColor: accentColor },
              ]}
            />

            {/* Agent title and description */}
            <Text style={styles.sectionTitle}>{config.name}</Text>
            <Text style={styles.sectionDescription}>
              {config.description}
            </Text>

            {/* Summary */}
            {output.summary && (
              <View
                style={[
                  styles.summaryBox,
                  { borderLeftColor: accentColor },
                ]}
              >
                <Text style={styles.summaryText}>
                  {sanitizeTruncatedContent(output.summary)}
                </Text>
              </View>
            )}

            {/* Key metadata badges */}
            {output.metadata &&
              Object.keys(output.metadata).length > 0 && (
                <View style={styles.metadataRow}>
                  {Object.entries(output.metadata).map(([key, value]) => (
                    <View key={key} style={styles.metadataBadge}>
                      <Text style={styles.metadataBadgeText}>
                        {formatMetadataKey(key)}: {String(value)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

            {/* Render content sections: check if it's the engineering manager agent */}
            {agentId === "engineering-manager" ? (
              <RenderEngineeringSection output={output} sections={sectionsToRender} />
            ) : (
              sectionsToRender.map((section, idx) => {
                const cleanHeading = section.heading.replace(/^(#{1,6})\s*/, "");
                return (
                  <View key={idx} wrap={true}>
                    <Text style={styles.subsectionTitle}>
                      {cleanHeading}
                    </Text>

                    {/* Render text content with bullet/numbered list support */}
                    <RenderContent content={section.content} />

                    {/* Render table if present */}
                    <RenderTable section={section} />
                  </View>
                );
              })
            )}

            {/* Footer */}
            <PageFooter startupName={input.startupName} />
          </Page>
        );
      })}
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts camelCase metadata keys to human-readable labels.
 * e.g. "viabilityScore" → "Viability Score"
 */
function formatMetadataKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
