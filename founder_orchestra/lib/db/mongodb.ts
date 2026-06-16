/**
 * =============================================================================
 * MONGODB CONNECTION
 * =============================================================================
 *
 * This file creates and manages the connection to MongoDB.
 * It uses a "singleton" pattern — meaning only ONE connection is created
 * and reused, instead of making a new connection every time.
 *
 * WHY: MongoDB has a limit on connections. Without this pattern,
 * Next.js hot-reload would create dozens of connections and crash.
 *
 * HOW TO USE:
 * In any API route or server-side code:
 *   import { connectDB } from "@/lib/db/mongodb";
 *   await connectDB();  // Then use your Mongoose models
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import mongoose from "mongoose";

/**
 * We store the connection promise globally so it persists
 * across Next.js hot-reloads in development.
 *
 * IMPORTANT: This is a standard Next.js + Mongoose pattern.
 * Don't modify unless you know what you're doing.
 */

/* eslint-disable no-var */
declare global {
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}
/* eslint-enable no-var */

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connects to MongoDB. Call this at the start of any API route.
 *
 * Example:
 *   export async function POST(request: Request) {
 *     await connectDB();
 *     // Now you can use Mongoose models
 *   }
 */
export async function connectDB(): Promise<typeof mongoose> {
  // ── Check that the environment variable is set ──────────────────────────
  if (!MONGODB_URI) {
    throw new Error(
      "❌ MONGODB_URI is not defined in environment variables.\n" +
        "   Please create a .env.local file with your MongoDB connection string.\n" +
        "   See .env.example for instructions."
    );
  }

  // ── Reuse existing connection if available ──────────────────────────────
  if (global.mongooseConnection) {
    return global.mongooseConnection;
  }

  // ── Create new connection ──────────────────────────────────────────────
  global.mongooseConnection = mongoose.connect(MONGODB_URI, {
    // These options optimize the connection for production use
    bufferCommands: false, // Disable buffering — fail fast if not connected
  });

  return global.mongooseConnection;
}

/**
 * Check if MongoDB is currently connected.
 * Useful for health checks or conditional logic.
 *
 * Returns: true if connected, false otherwise
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
