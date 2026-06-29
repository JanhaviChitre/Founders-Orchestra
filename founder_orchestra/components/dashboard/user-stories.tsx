/**
 * =============================================================================
 * COMPONENT — User Stories
 * =============================================================================
 *
 * List of user stories matching productManagerOutputSchema.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface UserStoryItem {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  epic: string;
}

interface UserStoriesProps {
  user_stories?: UserStoryItem[];
}

const DEFAULT_STORIES: UserStoryItem[] = [
  { id: "US-001", text: "As a busy professional, I want an AI adaptive workout so I can train efficiently.", epic: "Workout Engine", priority: "high" },
];

const PRIORITY_COLORS = {
  high: "bg-fo-rose",
  medium: "bg-fo-amber",
  low: "bg-fo-emerald",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
} as const;

export function UserStories({ user_stories = DEFAULT_STORIES }: UserStoriesProps) {
  const list = user_stories && user_stories.length > 0 ? user_stories : DEFAULT_STORIES;

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-1 flex items-center gap-2">
          <FileText size={14} />
          Core User Stories & Requirements
          <span className="font-mono text-[11px] text-fo-muted font-normal ml-auto">{list.length} total</span>
        </div>
        <p className="text-xs text-fo-muted mb-4">
          User-centric feature requirements prioritized for MVP and core product releases.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          {list.map((story) => (
            <motion.div
              key={story.id || story.text}
              variants={itemVariants}
              whileHover={{ x: 3 }}
              transition={{ x: { duration: 0.15 } }}
              className="flex items-start gap-3 p-3 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] cursor-default"
            >
              <div className={cn("w-[7px] h-[7px] rounded-full flex-shrink-0 mt-1.5", PRIORITY_COLORS[story.priority || "medium"])} />

              <div>
                <div className="font-mono text-[10px] text-fo-indigo font-semibold">{story.id}</div>
                <div className="text-[13px] leading-snug mt-0.5">{story.text}</div>
                <div className="text-[10px] text-fo-sub mt-1">Epic: {story.epic}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
