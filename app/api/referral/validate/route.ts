export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ valid: false });
  }

  const snap = await adminDb.collection("creatorCodes").doc(code).get();

  if (!snap.exists || !snap.data()?.active) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, displayName: snap.data()?.displayName });
}
