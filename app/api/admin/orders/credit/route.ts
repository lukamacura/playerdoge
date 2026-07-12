export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { creditPurchase, AlreadyCreditedError } from "@/lib/creditPurchase";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  let token: unknown;
  try {
    token = (await request.json())?.token;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const snap = await adminDb.collection("pendingPayments").doc(token).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  const order = snap.data()!;

  try {
    // Amounts come from the stored order, never from the client.
    await creditPurchase({
      uid: order.uid,
      coinAmount: order.coinAmount,
      usdValue: order.usdValue,
      game: "Coin Purchase",
      paymentMethod: "crypto",
      pendingPaymentToken: token,
      creditedBy: "admin",
    });
  } catch (e) {
    if (e instanceof AlreadyCreditedError) {
      return NextResponse.json({ error: "Already credited" }, { status: 409 });
    }
    const message = e instanceof Error ? e.message : "Failed to credit order";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
