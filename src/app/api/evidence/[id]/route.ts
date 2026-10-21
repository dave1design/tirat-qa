import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, hasCapability } from "@/lib/auth";
import { readEvidence } from "@/lib/evidence";

/** Evidence screenshots are private: only the owner and reviewers can fetch them. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  const report = await db.bugReport.findUnique({ where: { id }, select: { evidencePath: true, attempt: { select: { userId: true } } } });
  if (!report?.evidencePath) return new NextResponse("Not found", { status: 404 });
  if (report.attempt.userId !== user.id && !hasCapability(user.role, "review")) return new NextResponse("Forbidden", { status: 403 });
  try {
    const { buf, mime } = await readEvidence(report.evidencePath);
    return new NextResponse(new Uint8Array(buf), { headers: { "Content-Type": mime, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
