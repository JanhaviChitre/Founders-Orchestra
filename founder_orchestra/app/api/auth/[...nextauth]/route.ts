/**
 * =============================================================================
 * NEXTAUTH API ROUTE
 * =============================================================================
 *
 * This file creates the API endpoints that NextAuth needs:
 * - POST /api/auth/signin   → Handle sign-in
 * - POST /api/auth/signout  → Handle sign-out
 * - GET  /api/auth/session  → Get current session
 * - GET  /api/auth/providers → List available providers
 *
 * You don't need to modify this file.
 * All configuration is in lib/auth.ts.
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Next.js App Router requires exporting named HTTP methods
export { handler as GET, handler as POST };
