export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { creditPurchase } from "@/lib/creditPurchase";
import { verifyHmac, verifyPayment, OrderStatus } from "@/lib/paymento";

interface CallbackBody {
  Token?: string;
  PaymentId?: number;
  OrderId?: string;
  OrderStatus?: number;
  AdditionalData?: { key: string; value: string }[];
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("X-Hmac-Sha256-Signature") ||
    request.headers.get("x-hmac-sha256-signature") ||
    request.headers.get("HMAC_SHA256_SIGNATURE");

  if (!verifyHmac(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsed: CallbackBody;
  try {
    parsed = JSON.parse(rawBody) as CallbackBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = parsed.Token;
  const status = parsed.OrderStatus;
  if (!token || typeof status !== "number") {
    return NextResponse.json({ error: "Missing Token or OrderStatus" }, { status: 400 });
  }

  const pendingRef = adminDb.collection("pendingPayments").doc(token);
  const pendingSnap = await pendingRef.get();

  if (!pendingSnap.exists) {
    console.warn("[paymento] callback for unknown token", token);
    return NextResponse.json({ success: true, note: "unknown token" });
  }

  const pending = pendingSnap.data()!;
  const logEntry = { code: status, at: Timestamp.now() };

  if (pending.status === "credited") {
    await pendingRef.update({ statusLog: FieldValue.arrayUnion(logEntry) });
    return NextResponse.json({ success: true, note: "already credited" });
  }

  if (status === OrderStatus.Paid || status === OrderStatus.Approve) {
    const verified = await verifyPayment(token);
    if (!verified) {
      await pendingRef.update({
        statusLog: FieldValue.arrayUnion({ ...logEntry, note: "verify failed" }),
      });
      return NextResponse.json({ success: false, error: "verify failed" }, { status: 200 });
    }

    try {
      await creditPurchase({
        uid: pending.uid,
        coinAmount: pending.coinAmount,
        usdValue: pending.usdValue,
        game: "Coin Purchase",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "credit failed";
      await pendingRef.update({
        statusLog: FieldValue.arrayUnion({ ...logEntry, note: `credit failed: ${message}` }),
      });
      return NextResponse.json({ success: false, error: message }, { status: 200 });
    }

    await pendingRef.update({
      status: "credited",
      creditedAt: FieldValue.serverTimestamp(),
      statusLog: FieldValue.arrayUnion(logEntry),
    });

    return NextResponse.json({ success: true });
  }

  await pendingRef.update({ statusLog: FieldValue.arrayUnion(logEntry) });
  return NextResponse.json({ success: true });
}
