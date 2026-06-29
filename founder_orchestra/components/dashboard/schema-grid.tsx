/**
 * =============================================================================
 * COMPONENT — Schema Grid
 * =============================================================================
 *
 * Database schema tables matching architectOutputSchema.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Key, Link } from "lucide-react";

export interface SchemaTableItem {
  table: string;
  columns: Array<{
    name: string;
    type: string;
    is_pk: boolean;
    is_fk: boolean;
    nullable: boolean;
  }>;
}

interface SchemaGridProps {
  database_schema?: SchemaTableItem[];
}

export function SchemaGrid({ database_schema }: SchemaGridProps) {
  if (!database_schema || database_schema.length === 0) {
    return (
      <Card className="mb-7">
        <CardContent className="pt-5 pb-5 flex flex-col items-center justify-center min-h-[160px] text-center gap-2">
          <Database size={18} className="text-fo-muted" />
          <p className="text-sm font-semibold text-fo-sub">Database Schema</p>
          <p className="text-xs text-fo-muted">Architecture agent did not return schema data.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mb-7">
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-1 flex items-center gap-2">
          <Database size={14} />
          Relational Database Schema
        </div>
        <p className="text-xs text-fo-muted mb-4">
          Production entity modeling with primary keys, foreign key linkages, and field data types.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {database_schema.map((tbl) => (
            <div
              key={tbl.table}
              className="rounded-lg overflow-hidden border border-[rgba(99,102,241,.2)]"
            >
              <div className="bg-[rgba(99,102,241,.15)] px-3 py-2 font-mono text-xs font-semibold text-fo-indigo flex items-center gap-1.5">
                <Database size={10} />
                {tbl.table}
              </div>
              {(tbl.columns || []).map((col, colIdx) => (
                <div
                  key={`${col.name}-${colIdx}`}
                  className="flex items-center gap-2 px-3 py-1.5 border-t border-[rgba(255,255,255,.04)] font-mono text-[11px] hover:bg-[rgba(255,255,255,.03)]"
                >
                  <span className="text-fo-amber w-4 flex-shrink-0">
                    {col.is_pk && <Key size={10} />}
                    {col.is_fk && <Link size={10} className="text-fo-sky" />}
                  </span>
                  <span className="flex-1 text-fo-text">{col.name}</span>
                  <span className="text-fo-muted">{col.type}</span>
                  {col.is_pk && (
                    <Badge className="text-[9px] px-1.5 py-0 h-4 border-0 bg-[rgba(245,158,11,.15)] text-fo-amber">
                      PK
                    </Badge>
                  )}
                  {col.is_fk && (
                    <Badge className="text-[9px] px-1.5 py-0 h-4 border-0 bg-[rgba(56,189,248,.1)] text-fo-sky">
                      FK
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
