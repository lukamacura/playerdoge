import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export type PaymentMethod = "crypto" | "manual";

export const REFERRAL_BONUS_COINS = 100;

export class AlreadyCreditedError extends Error {
  constructor() {
    super("Order already credited");
    this.name = "AlreadyCreditedError";
  }
}

export interface CreditPurchaseInput {
  uid: string;
  coinAmount: number;
  usdValue?: number;
  game?: string;
  paymentMethod?: PaymentMethod;
  // When set, the pendingPayments/{token} doc is marked credited inside the
  // same transaction; throws AlreadyCreditedError if it already was.
  pendingPaymentToken?: string;
  creditedBy?: "webhook" | "admin" | "reconcile";
  orderStatusCode?: number;
}

export async function creditPurchase({
  uid,
  coinAmount,
  usdValue = 0,
  game = "Coin Purchase",
  paymentMethod = "manual",
  pendingPaymentToken,
  creditedBy,
  orderStatusCode,
}: CreditPurchaseInput): Promise<void> {
  if (!uid || !coinAmount || coinAmount <= 0) {
    throw new Error("creditPurchase: uid and positive coinAmount required");
  }

  const pendingRef = pendingPaymentToken
    ? adminDb.collection("pendingPayments").doc(pendingPaymentToken)
    : null;

  await adminDb.runTransaction(async (tx) => {
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await tx.get(userRef);
    if (!userDoc.exists) throw new Error("User not found");

    if (pendingRef) {
      const pendingDoc = await tx.get(pendingRef);
      if (!pendingDoc.exists) throw new Error("Pending payment not found");
      if (pendingDoc.data()?.status === "credited") throw new AlreadyCreditedError();
    }

    const data = userDoc.data()!;
    const creatorCode: string | null = data.creatorCode ?? null;
    const freePackageStatus: string = data.freePackageStatus ?? "ineligible";
    const grantBonus = creatorCode !== null && freePackageStatus === "pending";

    let commissionPct = 0;
    if (creatorCode && usdValue > 0) {
      const codeDoc = await tx.get(adminDb.collection("creatorCodes").doc(creatorCode));
      commissionPct = codeDoc.exists ? (codeDoc.data()?.commissionPct ?? 0) : 0;
    }

    const purchaseRef = userRef.collection("purchases").doc();
    tx.set(purchaseRef, {
      game,
      amount: coinAmount,
      image: "",
      timestamp: FieldValue.serverTimestamp(),
      creatorCode,
      isFreeBonus: false,
      usdValue,
      paymentMethod,
    });

    const userUpdate: Record<string, FieldValue | string | number | boolean | null> = {
      coins: FieldValue.increment(grantBonus ? coinAmount + REFERRAL_BONUS_COINS : coinAmount),
    };
    if (!data.firstPurchaseAt) {
      userUpdate.firstPurchaseAt = FieldValue.serverTimestamp();
    }
    if (grantBonus) {
      userUpdate.freePackageStatus = "granted";
    }
    tx.update(userRef, userUpdate);

    if (creatorCode) {
      const codeRef = adminDb.collection("creatorCodes").doc(creatorCode);
      const creatorUpdate: Record<string, FieldValue> = {};

      if (grantBonus) {
        const bonusRef = userRef.collection("purchases").doc();
        tx.set(bonusRef, {
          game: "Referral Bonus",
          amount: REFERRAL_BONUS_COINS,
          image: "",
          timestamp: FieldValue.serverTimestamp(),
          creatorCode,
          isFreeBonus: true,
          usdValue: 0,
          paymentMethod,
        });
        creatorUpdate.totalReferredUsers = FieldValue.increment(1);
      }

      if (usdValue > 0 && commissionPct > 0) {
        creatorUpdate.totalReferredRevenueUSD = FieldValue.increment(usdValue * commissionPct);
      }

      if (Object.keys(creatorUpdate).length > 0) {
        tx.update(codeRef, creatorUpdate);
      }
    }

    if (pendingRef) {
      tx.update(pendingRef, {
        status: "credited",
        creditedAt: FieldValue.serverTimestamp(),
        creditedBy: creditedBy ?? "webhook",
        statusLog: FieldValue.arrayUnion({
          code: orderStatusCode ?? null,
          at: Timestamp.now(),
          note:
            creditedBy === "admin"
              ? "credited manually by admin"
              : creditedBy === "reconcile"
                ? "credited via Paymento reconciliation"
                : "credited",
        }),
      });
    }
  });
}
