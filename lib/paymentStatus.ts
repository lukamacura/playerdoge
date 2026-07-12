// Shared vocabulary for pendingPayments order statuses.
// Client-safe: no server-only imports.

export type PendingPaymentStatus =
  | "initialized"
  | "processing"
  | "credited"
  | "expired"
  | "canceled"
  | "rejected"
  | "verify_failed"
  | "credit_failed";

// Orders still "initialized" after this long display as expired (abandoned checkout).
export const ORDER_STALE_MS = 2 * 60 * 60 * 1000;

// Paymento OrderStatus code -> stored status. null = leave status unchanged.
export function mapOrderStatusCode(code: number): PendingPaymentStatus | null {
  switch (code) {
    case 1: // Pending
    case 2: // PartialPaid
    case 3: // WaitingToConfirm
      return "processing";
    case 4: // Timeout
      return "expired";
    case 5: // UserCanceled
      return "canceled";
    case 9: // Reject
      return "rejected";
    default:
      return null;
  }
}

export function deriveDisplayStatus(
  status: string,
  createdAtMs: number | null,
  nowMs: number = Date.now()
): PendingPaymentStatus {
  if (
    status === "initialized" &&
    createdAtMs !== null &&
    nowMs - createdAtMs > ORDER_STALE_MS
  ) {
    return "expired";
  }
  return status as PendingPaymentStatus;
}

export function statusLabel(status: PendingPaymentStatus): string {
  switch (status) {
    case "initialized":
      return "Awaiting payment";
    case "processing":
      return "Processing";
    case "credited":
      return "Delivered";
    case "expired":
      return "Expired";
    case "canceled":
      return "Canceled";
    case "rejected":
      return "Rejected";
    case "verify_failed":
      return "Verification failed";
    case "credit_failed":
      return "Credit failed";
  }
}
