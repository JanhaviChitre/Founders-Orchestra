/**
 * =============================================================================
 * COMPONENT — Expandable Text / Analysis Dropdown
 * =============================================================================
 *
 * Reusable dropdown component to view full AI-generated analysis text.
 * Truncates long descriptions with an elegant inline "View full analysis ▼" button.
 *
 * Owner: Shared / UI
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn, renderMarkdown } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxChars?: number;
  className?: string;
  textClassName?: string;
  markdown?: boolean;
  expandLabel?: string;
  collapseLabel?: string;
}

export function ExpandableText({
  text,
  maxChars = 110,
  className,
  textClassName = "text-xs text-fo-sub leading-relaxed",
  markdown = false,
  expandLabel = "View full analysis",
  collapseLabel = "Show less",
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > maxChars;

  if (!shouldTruncate) {
    return (
      <div className={cn(textClassName, className)}>
        {markdown ? renderMarkdown(text) : text}
      </div>
    );
  }

  const truncatedText = `${text.slice(0, maxChars).trim()}…`;

  return (
    <div className={cn("space-y-1", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isExpanded ? "expanded" : "collapsed"}
          initial={{ opacity: 0, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={textClassName}
        >
          {isExpanded ? (
            markdown ? renderMarkdown(text) : text
          ) : (
            markdown ? renderMarkdown(truncatedText) : truncatedText
          )}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-fo-indigo hover:text-indigo-400 transition-colors cursor-pointer mt-1 focus:outline-none"
      >
        <span>{isExpanded ? collapseLabel : expandLabel}</span>
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
    </div>
  );
}
