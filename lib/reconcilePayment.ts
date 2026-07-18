import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { inquirePayment, OrderStatus } from "@/lib/paymento";
import { mapOrderStatusCode } from "@/lib/paymentStatus";
import { creditPurchase, AlreadyCreditedError } from "@/lib/creditPurchase";

// Statuses where the payment may have completed without us hearing about it.
const RECONCILABLE = new Set(["initialized", "processing", "verify_failed"]);

// Skip orders we already asked Paymento about recently (list endpoints only).
const CHECK_COOLDOWN_MS = 60 * 1000;

export interface PendingOrderData {
  uid?: string;
  coinAmount?: number;
  usdValue?: number;
  status?: string;
  reconcileCheckedAt?: { toMillis?: () => number };
}

export function isReconcilable(status: string | undefined): boolean {
  return RECONCILABLE.has(status ?? "initialized");
}

/**
 * The Paymento webhook does not reliably reach us, so paid orders can sit at
 * "initialized" forever. This asks Paymento directly whether the order was
 * paid (verify succeeds only for completed payments) and credits it if so.
 * Returns the up-to-date status.
 */
export async function reconcilePendingPayment(
  token: string,
  data: PendingOrderData,
  opts: { force?: boolean } = {}
): Promise<string> {
  const status = data.status ?? "initialized";
  if (!RECONCILABLE.has(status)) return status;

  const lastChecked = data.reconcileCheckedAt?.toMillis?.() ?? 0;
  if (!opts.force && Date.now() - lastChecked < CHECK_COOLDOWN_MS) return status;

  const ref = adminDb.collection("pendingPayments").doc(token);

  let inquiry;
  try {
    inquiry = await inquirePayment(token);
  } catch (e) {
    console.error("[reconcile] inquiry threw for", token, e);
    return status;
  }

  // null = network/parse error; don't touch anything, try again later.
  if (!inquiry) {
    await ref.update({ reconcileCheckedAt: FieldValue.serverTimestamp() });
    return status;
  }

  const paid =
    inquiry.success &&
    (inquiry.orderStatus === OrderStatus.Paid ||
      inquiry.orderStatus === OrderStatus.Approve ||
      inquiry.orderStatus === null);

  if (!paid) {
    // Not paid — record Paymento's real state (canceled/expired/rejected/processing)
    // so stuck "initialized" orders finally display correctly.
    const mapped =
      inquiry.orderStatus !== null ? mapOrderStatusCode(inquiry.orderStatus) : null;
    const update: Record<string, unknown> = {
      reconcileCheckedAt: FieldValue.serverTimestamp(),
    };
    if (mapped && mapped !== status && (status === "initialized" || status === "processing")) {
      update.status = mapped;
      update.statusLog = FieldValue.arrayUnion({
        code: inquiry.orderStatus,
        at: Timestamp.now(),
        note: "status synced via Paymento reconciliation",
      });
    }
    await ref.update(update);
    return (update.status as string | undefined) ?? status;
  }

  try {
    await creditPurchase({
      uid: data.uid ?? "",
      coinAmount: data.coinAmount ?? 0,
      usdValue: data.usdValue ?? 0,
      game: "Coin Purchase",
      paymentMethod: "crypto",
      pendingPaymentToken: token,
      creditedBy: "reconcile",
    });
  } catch (e) {
    if (e instanceof AlreadyCreditedError) return "credited";
    const message = e instanceof Error ? e.message : "credit failed";
    await ref.update({
      status: "credit_failed",
      statusLog: FieldValue.arrayUnion({
        code: null,
        at: Timestamp.now(),
        note: `reconcile credit failed: ${message}`,
      }),
    });
    return "credit_failed";
  }

  return "credited";
}

/**
 * Reconcile a batch of pending-payment docs (dashboard / admin lists).
 * Returns the tokens whose status changed so callers can re-read them.
 */
export async function reconcileMany(
  docs: { token: string; data: PendingOrderData }[],
  concurrency = 8
): Promise<string[]> {
  const candidates = docs.filter((d) => isReconcilable(d.data.status));
  const changed: string[] = [];

  for (let i = 0; i < candidates.length; i += concurrency) {
    const chunk = candidates.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      chunk.map(async ({ token, data }) => {
        const before = data.status ?? "initialized";
        const after = await reconcilePendingPayment(token, data);
        return after !== before ? token : null;
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) changed.push(r.value);
    }
  }

  return changed;
}
