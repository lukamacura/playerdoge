import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export interface CreditPurchaseInput {
  uid: string;
  coinAmount: number;
  usdValue?: number;
  game?: string;
}

export async function creditPurchase({
  uid,
  coinAmount,
  usdValue = 0,
  game = "Coin Purchase",
}: CreditPurchaseInput): Promise<void> {
  if (!uid || !coinAmount || coinAmount <= 0) {
    throw new Error("creditPurchase: uid and positive coinAmount required");
  }

  await adminDb.runTransaction(async (tx) => {
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await tx.get(userRef);
    if (!userDoc.exists) throw new Error("User not found");

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
    });

    const userUpdate: Record<string, FieldValue | string | number | boolean | null> = {
      coins: FieldValue.increment(grantBonus ? coinAmount + 500 : coinAmount),
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
          amount: 500,
          image: "",
          timestamp: FieldValue.serverTimestamp(),
          creatorCode,
          isFreeBonus: true,
          usdValue: 0,
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
  });
}
