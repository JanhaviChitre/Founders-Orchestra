import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();
    const isDbConnected = mongoose.connection.readyState === 1;

    // Optional: Get basic memory stats
    const memoryUsage = process.memoryUsage();

    return NextResponse.json(
      {
        status: "ok",
        database: isDbConnected ? "connected" : "disconnected",
        uptime: process.uptime(),
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: isDbConnected ? 200 : 503 }
    );
  } catch (error) {
    console.error("[/api/health] Error:", error);
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 500 }
    );
  }
}
