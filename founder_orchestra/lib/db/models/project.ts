/**
 * =============================================================================
 * MONGOOSE MODEL — PROJECT
 * =============================================================================
 *
 * This defines the "shape" of a Project document in MongoDB.
 * Think of it as a template — every project saved to the database
 * must follow this structure.
 *
 * WHAT IS A MODEL?
 * A Mongoose model is like a class that maps to a MongoDB "collection"
 * (similar to a table in SQL). You use it to create, read, update,
 * and delete documents.
 *
 * Example usage in an API route:
 *   import { Project } from "@/lib/db/models/project";
 *   const projects = await Project.find({ userId: "123" });
 *   const newProject = await Project.create({ input: {...}, ... });
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import mongoose, { Schema, type Document } from "mongoose";
import type { StartupInput, AgentOutput, OrchestrationStatus } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// TYPESCRIPT INTERFACE
// ─────────────────────────────────────────────────────────────────────────────
// This tells TypeScript what fields a Project document has.
// It combines our custom fields with Mongoose's built-in Document fields.

export interface IProject extends Document {
  userId: string;
  input: StartupInput;
  agents: Record<string, AgentOutput>;
  overallStatus: OrchestrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// MONGOOSE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
// The schema defines validation rules and defaults for each field.
// MongoDB will enforce these when saving documents.

const ProjectSchema = new Schema<IProject>(
  {
    // Who owns this project
    userId: {
      type: String,
      required: true,
      index: true, // Makes lookups by userId fast
    },

    // The founder's startup input
    input: {
      startupName: { type: String, required: true },
      idea: { type: String, required: true },
      industry: { type: String, default: "" },
      targetAudience: { type: String, default: "" },
      budget: { type: String, default: "" },
      additionalContext: { type: String, default: "" },
    },

    // Agent outputs — stored as a flexible object
    // Each key is an AgentId, each value is an AgentOutput
    agents: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // Overall pipeline status
    overallStatus: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "partial", "paused"],
      default: "not-started",
    },
  },
  {
    // Mongoose will automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT THE MODEL
// ─────────────────────────────────────────────────────────────────────────────
// The "mongoose.models.Project ||" part prevents errors when Next.js
// hot-reloads — it reuses the existing model instead of redefining it.

export const Project =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  mongoose.model<IProject>("Project", ProjectSchema);
