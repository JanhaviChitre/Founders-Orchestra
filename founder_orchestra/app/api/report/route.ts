/**
 * =============================================================================
 * API ROUTE — /api/report
 * =============================================================================
 *
 * Generates a PDF report from a project's agent outputs.
 *
 * HOW IT WORKS:
 * 1. Frontend sends a POST request with the project ID
 * 2. We fetch the project from MongoDB
 * 3. We use @react-pdf/renderer to generate a PDF
 * 4. We return the PDF as a downloadable file
 *
 * TODO (Team Member C):
 * - Implement the actual PDF generation (see lib/pdf/report-template.tsx)
 * - Add charts as static images in the PDF
 * - Add company branding/logo
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Project } from "@/lib/db/models/project";
// TODO: Uncomment when PDF template is fully implemented
// import { renderToBuffer } from "@react-pdf/renderer";
// import { ReportDocument } from "@/lib/pdf/report-template";

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ── Fetch project ───────────────────────────────────────────────────
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // ── Generate PDF ────────────────────────────────────────────────────
    // TODO: Replace this placeholder with actual PDF generation
    // Once lib/pdf/report-template.tsx is ready, use:
    //
    // const pdfBuffer = await renderToBuffer(
    //   <ReportDocument project={project} />
    // );
    //
    // return new Response(pdfBuffer, {
    //   headers: {
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": `attachment; filename="${project.input.startupName}-report.pdf"`,
    //   },
    // });

    // ── Placeholder response ────────────────────────────────────────────
    return NextResponse.json({
      message: "PDF generation endpoint ready. Implement report-template.tsx to enable.",
      projectId: project._id,
      startupName: project.input.startupName,
    });
  } catch (error) {
    console.error("[/api/report] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
