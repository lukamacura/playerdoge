export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { createPaymentRequest, gatewayUrl } from "@/lib/paymento";

export const PACKS = {
  "usd-2000": { coinAmount: 2000, usdValue: 17.99 },
  "usd-5000": { coinAmount: 5000, usdValue: 43.99 },
  "usd-10000": { coinAmount: 10000, usdValue: 87.99 },
  "usd-100000": { coinAmount: 100000, usdValue: 879.99 },
} as const;

export type PackId = keyof typeof PACKS;

function isPackId(v: unknown): v is PackId {
  return typeof v === "string" && v in PACKS;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  let email: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const packId = (body as { packId?: unknown })?.packId;
  if (!isPackId(packId)) {
    return NextResponse.json({ error: "Invalid packId" }, { status: 400 });
  }

  const pack = PACKS[packId];
  const orderId = `pd-${uid}-${Date.now()}`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const returnUrl = `${siteUrl}/buycoins/success`;

  let token: string;
  try {
    token = await createPaymentRequest({
      fiatAmount: pack.usdValue.toFixed(2),
      fiatCurrency: "USD",
      orderId,
      returnUrl,
      additionalData: [
        { key: "uid", value: uid },
        { key: "packId", value: packId },
      ],
      email,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Paymento error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  await adminDb
    .collection("pendingPayments")
    .doc(token)
    .set({
      uid,
      packId,
      coinAmount: pack.coinAmount,
      usdValue: pack.usdValue,
      orderId,
      paymentoToken: token,
      status: "initialized",
      statusLog: [],
      createdAt: FieldValue.serverTimestamp(),
    });

  return NextResponse.json({
    success: true,
    token,
    redirectUrl: gatewayUrl(token),
  });
}
