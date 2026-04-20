export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
          isFreeBonus: data.isFreeBonus ?? false,
          creatorCode: data.creatorCode ?? null,
        };
      });
    })
  );

  const allTransactions = results.flat();

  allTransactions.sort((a, b) => b.timestampMs - a.timestampMs);

  return NextResponse.json(allTransactions);
  } catch (err) {
    console.error("Admin transactions error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
