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

export function verifyHmac(rawBody: string, receivedSignature: string | null): boolean {
  if (!receivedSignature) return false;
  const expected = crypto
    .createHmac("sha256", secretKey())
    .update(rawBody, "utf8")
    .digest("hex")
    .toUpperCase();
  const received = receivedSignature.trim().toUpperCase();
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
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
