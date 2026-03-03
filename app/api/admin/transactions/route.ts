export const runtime = "nodejs";

import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const usersSnapshot = await adminDb.collection("users").get();

  const results = await Promise.all(
    usersSnapshot.docs.map(async (userDoc) => {
      const uid = userDoc.id;
      const userEmail = userDoc.data().email ?? "";

      const purchasesSnapshot = await adminDb
        .collection("users")
        .doc(uid)
        .collection("purchases")
        .get();

      return purchasesSnapshot.docs.map((purchaseDoc) => {
        const data = purchaseDoc.data();
        return {
          userEmail,
          uid,
          game: data.game ?? "",
          amount: data.amount ?? 0,
          timestampMs: data.timestamp?.toMillis?.() ?? 0,
        };
      });
    })
  );

  const allTransactions = results.flat();

  allTransactions.sort((a, b) => b.timestampMs - a.timestampMs);

  return NextResponse.json(allTransactions);
}
