export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const snapshot = await adminDb.collection("creatorCodes").orderBy("createdAt", "desc").get();
  const creators = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      code: doc.id,
      displayName: d.displayName ?? "",
      active: d.active ?? false,
      creatorUid: d.creatorUid ?? null,
      commissionPct: d.commissionPct ?? 0,
      totalReferredUsers: d.totalReferredUsers ?? 0,
      totalReferredRevenueUSD: d.totalReferredRevenueUSD ?? 0,
      createdAt: d.createdAt?.toMillis() ?? null,
    };
  });
  return NextResponse.json(creators);
}

export async function PATCH(request: Request) {
  const { code, active } = await request.json();
  if (!code || typeof active !== "boolean") {
    return NextResponse.json({ error: "code and active required" }, { status: 400 });
  }
  await adminDb.collection("creatorCodes").doc(code).update({ active });
  return NextResponse.json({ success: true });
}
