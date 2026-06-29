/**
 * =============================================================================
 * COMPONENT — Market Sizing Card (Recharts)
 * =============================================================================
 *
 * TAM/SAM/SOM horizontal bar chart implemented with Recharts and Custom Tooltips.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { renderMarkdown } from "@/lib/utils";
import { ExpandableText } from "@/components/ui/expandable-text";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface MarketSizingData {
  tam: { value: string; numeric: number };
  sam: { value: string; numeric: number };
  som: { value: string; numeric: number };
  insight: string;
}

interface MarketSizingProps {
  market_sizing?: MarketSizingData;
}

const DEFAULT_DATA: MarketSizingData = {
  tam: { value: "$42B", numeric: 42000000000 },
  sam: { value: "$9.8B", numeric: 9800000000 },
  som: { value: "$490M", numeric: 490000000 },
  insight:
    'Busy professionals (25–45, $80K+) represent an underserved segment. Niche positioning in "micro-workout" category shows 3× lower CAC than broad fitness apps.',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0D121F] border border-border px-3 py-2 rounded-lg shadow-xl text-xs">
        <div className="font-semibold text-fo-text mb-1 font-display">{data.fullName}</div>
        <div className="text-fo-sub">
          Value: <span className="font-mono text-fo-text font-bold">{data.valueStr}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function MarketSizing({ market_sizing = DEFAULT_DATA }: MarketSizingProps) {
  const data = market_sizing || DEFAULT_DATA;
  const maxNum = Math.max(data.tam.numeric || 1, 1);

  const chartData = [
    {
      name: "TAM",
      fullName: "TAM — Total Addressable Market",
      barPercent: 100,
      valueStr: data.tam.value,
      color: "#6366F1",
    },
    {
      name: "SAM",
      fullName: "SAM — Serviceable Addressable Market",
      barPercent: Math.max(5, Math.round(((data.sam.numeric || 0) / maxNum) * 100)),
      valueStr: data.sam.value,
      color: "#38BDF8",
    },
    {
      name: "SOM",
      fullName: "SOM — Serviceable Obtainable Market",
      barPercent: Math.max(3, Math.round(((data.som.numeric || 0) / maxNum) * 100)),
      valueStr: data.som.value,
      color: "#10B981",
    },
  ];

  return (
    <Card>
      <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
        <div>
          <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-1 flex items-center gap-2">
            <BarChart3 size={14} />
            Market Sizing Breakdown
          </div>
          <p className="text-xs text-fo-muted mb-4">
            Quantitative valuation analysis for TAM, SAM, and SOM target markets.
          </p>

          <div className="h-[130px] w-full -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 15, left: -10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.02)" }}
                />
                <Bar dataKey="barPercent" radius={[0, 4, 4, 0]} barSize={10}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-t border-border/50 pt-3 mt-2 flex flex-col justify-end">
          <div className="text-[11px] font-medium text-fo-sub uppercase tracking-[0.5px] mb-1">
            Key Insight
          </div>
          <ExpandableText
            text={data.insight}
            maxChars={100}
            textClassName="text-xs text-fo-text leading-relaxed"
            markdown
          />
        </div>
      </CardContent>
    </Card>
  );
}
