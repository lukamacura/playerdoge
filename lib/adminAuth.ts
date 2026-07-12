import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { ADMIN_EMAILS } from "@/lib/adminEmails";

// Returns the admin's email on success, or a ready-to-return error response.
export async function requireAdmin(
  request: Request
): Promise<{ email: string } | NextResponse> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
    if (!decoded.email || !ADMIN_EMAILS.includes(decoded.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return { email: decoded.email };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
