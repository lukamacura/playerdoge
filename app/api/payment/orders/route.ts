export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { deriveDisplayStatus } from "@/lib/paymentStatus";

// Dead orders (expired/canceled/rejected) disappear from the dashboard after this.
const HIDE_DEAD_AFTER_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Equality-only filter: no composite index needed; sort in memory.
  const snap = await adminDb
    .collection("pendingPayments")
    .where("uid", "==", uid)
    .limit(50)
    .get();

  const now = Date.now();
  const orders = snap.docs
    .map((doc) => {
      const d = doc.data();
      const createdAtMs = d.createdAt?.toMillis?.() ?? null;
      return {
        token: doc.id,
        packId: (d.packId ?? "") as string,
        coinAmount: (d.coinAmount ?? 0) as number,
        usdValue: (d.usdValue ?? 0) as number,
        status: deriveDisplayStatus(d.status ?? "initialized", createdAtMs, now),
        createdAtMs,
        creditedAtMs: d.creditedAt?.toMillis?.() ?? null,
      };
    })
    .filter((o) => {
      const dead = o.status === "expired" || o.status === "canceled" || o.status === "rejected";
      if (!dead) return true;
      return o.createdAtMs !== null && now - o.createdAtMs < HIDE_DEAD_AFTER_MS;
    })
    .sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));

  return NextResponse.json({ orders });
}
