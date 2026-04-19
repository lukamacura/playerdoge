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

  const userRef = adminDb.collection("users").doc(uid);

  await adminDb.runTransaction(async (tx) => {
    const userDoc = await tx.get(userRef);
    if (!userDoc.exists) throw new Error("User not found");

    const data = userDoc.data()!;
    const creatorCode: string | null = data.creatorCode ?? null;
    const freePackageStatus: string = data.freePackageStatus ?? "ineligible";
    const grantBonus = creatorCode !== null && freePackageStatus === "pending";

    // Paid purchase doc
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

    // Single atomic user update
    const userUpdate: Record<string, unknown> = {
      coins: FieldValue.increment(grantBonus ? coinAmount + 500 : coinAmount),
    };
    if (!data.firstPurchaseAt) {
      userUpdate.firstPurchaseAt = FieldValue.serverTimestamp();
    }
    if (grantBonus) {
      userUpdate.freePackageStatus = "granted";
    }
    tx.update(userRef, userUpdate);

    if (grantBonus) {
      // Bonus purchase doc
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

      // Update creator stats
      const codeRef = adminDb.collection("creatorCodes").doc(creatorCode);
      tx.update(codeRef, {
        totalReferredUsers: FieldValue.increment(1),
        totalReferredRevenueUSD: FieldValue.increment(usdValue),
      });
    }
  });

  return NextResponse.json({ success: true });
}
