export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { deriveDisplayStatus } from "@/lib/paymentStatus";
import { reconcileMany } from "@/lib/reconcilePayment";

interface RawLogEntry {
  code?: number | null;
  at?: { toMillis?: () => number };
  note?: string;
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const snap = await adminDb
    .collection("pendingPayments")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  // The Paymento webhook is unreliable — check open orders against Paymento
  // so paid ones show as credited here without waiting for the callback.
  const changedTokens = await reconcileMany(
    snap.docs.map((doc) => ({ token: doc.id, data: doc.data() }))
  );
  const freshById = new Map<string, FirebaseFirestore.DocumentData>();
  if (changedTokens.length) {
    const fresh = await adminDb.getAll(
      ...changedTokens.map((t) => adminDb.collection("pendingPayments").doc(t))
    );
    for (const d of fresh) if (d.exists) freshById.set(d.id, d.data()!);
  }

  const uids = Array.from(
    new Set(snap.docs.map((d) => d.data().uid as string).filter(Boolean))
  );
  const userDocs = uids.length
    ? await adminDb.getAll(...uids.map((uid) => adminDb.collection("users").doc(uid)))
    : [];
  const emailByUid = new Map(userDocs.map((d) => [d.id, (d.data()?.email ?? "") as string]));

  const now = Date.now();
  const orders = snap.docs.map((doc) => {
    const d = freshById.get(doc.id) ?? doc.data();
    const createdAtMs = d.createdAt?.toMillis?.() ?? null;
    return {
      token: doc.id,
      uid: (d.uid ?? "") as string,
      userEmail: emailByUid.get(d.uid) ?? "(deleted user)",
      orderId: (d.orderId ?? "") as string,
      packId: (d.packId ?? "") as string,
      coinAmount: (d.coinAmount ?? 0) as number,
      usdValue: (d.usdValue ?? 0) as number,
      status: deriveDisplayStatus(d.status ?? "initialized", createdAtMs, now),
      rawStatus: (d.status ?? "initialized") as string,
      createdAtMs,
      creditedAtMs: d.creditedAt?.toMillis?.() ?? null,
      creditedBy: (d.creditedBy ?? null) as string | null,
      statusLog: (Array.isArray(d.statusLog) ? (d.statusLog as RawLogEntry[]) : []).map((e) => ({
        code: e.code ?? null,
        atMs: e.at?.toMillis?.() ?? null,
        note: e.note ?? null,
      })),
    };
  });

  return NextResponse.json({ orders });
}
