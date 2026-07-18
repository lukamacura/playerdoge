import crypto from "crypto";

const API_BASE = "https://api.paymento.io/v1";
const GATEWAY_BASE = "https://app.paymento.io/gateway";

function apiKey() {
  const key = process.env.PAYMENTO_API_KEY;
  if (!key) throw new Error("PAYMENTO_API_KEY is not set");
  return key;
}

function secretKey() {
  const key = process.env.PAYMENTO_SECRET_KEY;
  if (!key) throw new Error("PAYMENTO_SECRET_KEY is not set");
  return key;
}

export type AdditionalDataEntry = { key: string; value: string };

export interface CreatePaymentInput {
  fiatAmount: string;
  fiatCurrency: string;
  orderId: string;
  returnUrl: string;
  additionalData?: AdditionalDataEntry[];
  email?: string;
  speed?: 0 | 1;
}

interface PaymentoEnvelope<T> {
  success: boolean;
  message?: string;
  body: T;
}

export async function createPaymentRequest(input: CreatePaymentInput): Promise<string> {
  const payload: Record<string, unknown> = {
    fiatAmount: input.fiatAmount,
    fiatCurrency: input.fiatCurrency,
    ReturnUrl: input.returnUrl,
    orderId: input.orderId,
    Speed: input.speed ?? 1,
  };
  if (input.additionalData?.length) payload.additionalData = input.additionalData;
  if (input.email) payload.EmailAddress = input.email;

  const res = await fetch(`${API_BASE}/payment/request`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey(),
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Paymento request failed (${res.status}): ${text}`);
  }

  let parsed: PaymentoEnvelope<string> | string;
  try {
    parsed = JSON.parse(text) as PaymentoEnvelope<string>;
  } catch {
    parsed = text;
  }

  const rawToken =
    typeof parsed === "string"
      ? parsed
      : typeof parsed.body === "string"
        ? parsed.body
        : "";

  const token = rawToken.trim();
  if (!token) throw new Error(`Paymento request returned no token: ${text}`);
  return token;
}

export interface VerifyPaymentResult {
  token: string;
  orderId: string;
  additionalData?: AdditionalDataEntry[];
}

export interface PaymentInquiry {
  // Paymento sets success=true only when the payment completed.
  success: boolean;
  // Present even when success=false (e.g. 0=Initialize, 4=Timeout, 5=UserCanceled).
  orderStatus: number | null;
}

/**
 * Ask Paymento for an order's current state via the verify endpoint. Unlike
 * verifyPayment this also surfaces the orderStatus of unpaid orders, so
 * callers can tell "canceled/expired" apart from "network error" (null).
 */
export async function inquirePayment(token: string): Promise<PaymentInquiry | null> {
  const res = await fetch(`${API_BASE}/payment/verify`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey(),
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify({ token }),
  });

  const text = await res.text();
  if (!res.ok) return null;

  try {
    const parsed = JSON.parse(text) as PaymentoEnvelope<{ orderStatus?: number }>;
    return {
      success: parsed.success === true,
      orderStatus:
        typeof parsed.body?.orderStatus === "number" ? parsed.body.orderStatus : null,
    };
  } catch {
    return null;
  }
}

export async function verifyPayment(token: string): Promise<VerifyPaymentResult | null> {
  const res = await fetch(`${API_BASE}/payment/verify`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey(),
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify({ token }),
  });

  const text = await res.text();
  if (!res.ok) return null;

  try {
    const parsed = JSON.parse(text) as PaymentoEnvelope<VerifyPaymentResult>;
    if (!parsed.success || !parsed.body) return null;
    return parsed.body;
  } catch {
    return null;
  }
}

export function computeHmac(rawBody: string): string {
  return crypto
    .createHmac("sha256", secretKey())
    .update(rawBody, "utf8")
    .digest("hex")
    .toUpperCase();
}

export function verifyHmac(rawBody: string, receivedSignature: string | null): boolean {
  if (!receivedSignature) return false;
  const expected = computeHmac(rawBody);
  const received = receivedSignature.trim().toUpperCase();
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function findSignatureHeader(headers: Headers): { name: string | null; value: string | null } {
  const candidates = [
    "X-Hmac-Sha256-Signature",
    "x-hmac-sha256-signature",
    "X-HMAC-SHA256-SIGNATURE",
    "HMAC_SHA256_SIGNATURE",
    "hmac_sha256_signature",
    "Hmac-Sha256-Signature",
    "hmac-sha256-signature",
  ];
  for (const name of candidates) {
    const v = headers.get(name);
    if (v) return { name, value: v };
  }
  let match: { name: string; value: string } | null = null;
  headers.forEach((value, name) => {
    if (match) return;
    if (/hmac.*sha.*256.*sig/i.test(name) || /sig.*hmac/i.test(name)) {
      match = { name, value };
    }
  });
  if (match) return match;
  return { name: null, value: null };
}

export function gatewayUrl(token: string): string {
  return `${GATEWAY_BASE}?token=${encodeURIComponent(token)}`;
}

export const OrderStatus = {
  Initialize: 0,
  Pending: 1,
  PartialPaid: 2,
  WaitingToConfirm: 3,
  Timeout: 4,
  UserCanceled: 5,
  Paid: 7,
  Approve: 8,
  Reject: 9,
} as const;
