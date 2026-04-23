export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { creditPurchase } from "@/lib/creditPurchase";
import { verifyHmac, verifyPayment, OrderStatus, findSignatureHeader, computeHmac } from "@/lib/paymento";

interface CallbackBody {
  Token?: string;
  PaymentId?: number;
  OrderId?: string;
  OrderStatus?: number;
  AdditionalData?: { key: string; value: string }[];
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const allHeaderNames = Array.from(request.headers.keys());
  const found = findSignatureHeader(request.headers);

  console.log("[paymento-callback] incoming", {
    bodyLength: rawBody.length,
    bodyPreview: rawBody.slice(0, 200),
    sigHeaderName: found.name,
    sigValue: found.value ? `${found.value.slice(0, 12)}...` : null,
    allHeaderNames,
  });

  if (!found.value) {
    console.warn("[paymento-callback] no signature header found — headers received:", allHeaderNames);
    return NextResponse.json(
      { error: "Missing signature header", receivedHeaders: allHeaderNames },
      { status: 401 },
    );
  }

  if (!verifyHmac(rawBody, found.value)) {
    const expected = computeHmac(rawBody);
    console.warn("[paymento-callback] HMAC mismatch", {
      expectedPreview: `${expected.slice(0, 16)}...`,
      receivedPreview: `${found.value.trim().toUpperCase().slice(0, 16)}...`,
      bodyLength: rawBody.length,
    });
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
        paymentMethod: "crypto",
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
