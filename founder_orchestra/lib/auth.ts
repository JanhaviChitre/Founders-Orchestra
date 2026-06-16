/**
 * =============================================================================
 * AUTHENTICATION CONFIGURATION — NextAuth.js
 * =============================================================================
 *
 * This file configures how users sign in to the app.
 * For now, we use "Credentials" provider (email + password).
 *
 * TODO (Team Member C): You can add more providers later:
 * - Google OAuth: https://next-auth.js.org/providers/google
 * - GitHub OAuth: https://next-auth.js.org/providers/github
 *
 * HOW IT WORKS:
 * 1. User visits /api/auth/signin
 * 2. NextAuth shows a sign-in form
 * 3. User enters credentials
 * 4. We verify against MongoDB
 * 5. A session cookie is created
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";

export const authOptions: NextAuthOptions = {
  // ── Providers: How users can sign in ────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "founder@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      /**
       * This function runs when a user tries to sign in.
       *
       * TODO (Team Member C):
       * - Add proper password hashing with bcrypt
       * - Add input validation
       * - Add rate limiting to prevent brute-force attacks
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // null = sign-in failed
        }

        await connectDB();

        // ── Find or create user (simplified for boilerplate) ──────────
        // In production, you should verify the password hash
        let user = await User.findOne({ email: credentials.email });

        if (!user) {
          // Auto-create user for development convenience
          // TODO: Replace with proper registration flow
          user = await User.create({
            name: credentials.email.split("@")[0],
            email: credentials.email,
            projects: [],
          });
        }

        // Return the user object — NextAuth will create a session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  // ── Session Configuration ──────────────────────────────────────────────
  session: {
    strategy: "jwt", // Use JWT tokens (stateless, works well with Vercel)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ── Callbacks: Customize session/token data ────────────────────────────
  callbacks: {
    /**
     * When a JWT token is created, add the user's MongoDB ID to it.
     * This lets us look up the user in the database from any API route.
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    /**
     * When the session is read (e.g., in a React component),
     * include the user's MongoDB ID.
     */
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },

  // ── Pages: Custom auth pages (optional) ────────────────────────────────
  pages: {
    signIn: "/", // Redirect to landing page for sign-in
    // TODO: Create custom sign-in / sign-up pages
  },

  // ── Secret: Used to encrypt tokens ─────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,
};
