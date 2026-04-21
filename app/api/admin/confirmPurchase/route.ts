export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const { uid, coinAmount, usdValue = 0, game = "Coin Purchase" } = await request.json();

  if (!uid || !coinAmount || coinAmount <= 0) {
    return NextResponse.json({ error: "uid and coinAmount are required" }, { status: 400 });
  }

  await adminDb.runTransaction(async (tx) => {
    const userRef2 = adminDb.collection("users").doc(uid);
    const userDoc = await tx.get(userRef2);
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

    // Paid purchase doc
    const purchaseRef = userRef2.collection("purchases").doc();
    tx.set(purchaseRef, {
      game,
      amount: coinAmount,
      image: "",
      timestamp: FieldValue.serverTimestamp(),
      creatorCode,
      isFreeBonus: false,
      usdValue,
    });

    // Single atomic user update
    const userUpdate: Record<string, FieldValue | string | number | boolean | null> = {
      coins: FieldValue.increment(grantBonus ? coinAmount + 500 : coinAmount),
    };
    if (!data.firstPurchaseAt) {
      userUpdate.firstPurchaseAt = FieldValue.serverTimestamp();
    }
    if (grantBonus) {
      userUpdate.freePackageStatus = "granted";
    }
    tx.update(userRef2, userUpdate);

    if (creatorCode) {
      const codeRef = adminDb.collection("creatorCodes").doc(creatorCode);
      const creatorUpdate: Record<string, FieldValue> = {};

      if (grantBonus) {
        // Bonus purchase doc
        const bonusRef = userRef2.collection("purchases").doc();
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

  return NextResponse.json({ success: true });
}
