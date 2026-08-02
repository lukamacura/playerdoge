export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { createPaymentRequest, gatewayUrl } from "@/lib/paymento";
import { PACKS, isPackId } from "@/lib/packs";

/**
 * Paymento refuses any non-HTTPS ReturnUrl ("Only HTTPS URLs are allowed"), so
 * a misconfigured base silently breaks every purchase. Upgrade http:// to
 * https:// where that is safe, and fail with an actionable message otherwise.
 */
function buildReturnUrl(base: string): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    throw new Error(`Invalid site URL for Paymento return: "${base}"`);
  }

  const isLocal =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname.endsWith(".local");

  if (isLocal) {
    throw new Error(
      "Paymento requires an HTTPS return URL, but the site URL is local " +
        `("${base}"). Set PAYMENTO_RETURN_URL_BASE to a public HTTPS URL to test payments.`
    );
  }

  url.protocol = "https:";
  url.pathname = "/buycoins/success";
  url.search = "";
  url.hash = "";
  return url.toString();
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

  // Paymento only accepts HTTPS return URLs — an http:// one (e.g. a local
  // NEXT_PUBLIC_SITE_URL) makes every purchase fail before it starts.
  let returnUrl: string;
  try {
    returnUrl = buildReturnUrl(
      process.env.PAYMENTO_RETURN_URL_BASE ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        new URL(request.url).origin
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid return URL";
    console.error("[payment/create] return URL misconfigured:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

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
    console.error("[payment/create] Paymento request failed", { uid, packId, orderId, message });
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // The Paymento order now exists. If we cannot record it the user could still
  // pay against a token we have no record of, so bail out loudly (with the token
  // in the logs for recovery) instead of handing back a checkout link.
  try {
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "write failed";
    console.error(
      "[payment/create] ORPHANED PAYMENTO ORDER — could not persist pendingPayments doc",
      { token, uid, packId, orderId, usdValue: pack.usdValue, message }
    );
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    token,
    redirectUrl: gatewayUrl(token),
  });
}
