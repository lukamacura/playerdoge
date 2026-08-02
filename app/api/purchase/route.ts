export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { gameData } from "@/lib/gameData";
import { GAME_PACK_COINS, MAX_PURCHASE_QUANTITY, isPackIndex } from "@/lib/gamePacks";

class InsufficientCoinsError extends Error {
  constructor(readonly balance: number) {
    super("Insufficient coins");
    this.name = "InsufficientCoinsError";
  }
}

// Support needs the notes, but there is no reason to keep an unbounded blob.
const MAX_NOTES_LENGTH = 2000;

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, packIndex, quantity, notes, country } = (body ?? {}) as {
    slug?: unknown;
    packIndex?: unknown;
    quantity?: unknown;
    notes?: unknown;
    country?: unknown;
  };

  const game = gameData.find((g) => g.slug === slug);
  if (!game) {
    return NextResponse.json({ error: "Unknown game" }, { status: 400 });
  }
  if (!isPackIndex(packIndex)) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }
  if (
    !Number.isInteger(quantity) ||
    (quantity as number) < 1 ||
    (quantity as number) > MAX_PURCHASE_QUANTITY
  ) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const packCoins = GAME_PACK_COINS[packIndex];
  const totalCoins = packCoins * (quantity as number);

  try {
    const remainingCoins = await adminDb.runTransaction(async (tx) => {
      const userRef = adminDb.collection("users").doc(uid);
      const userDoc = await tx.get(userRef);
      if (!userDoc.exists) throw new Error("User not found");

      const data = userDoc.data()!;
      const balance: number = data.coins ?? 0;
      if (balance < totalCoins) throw new InsufficientCoinsError(balance);

      // Deducting the coins and logging the order must be one atomic write —
      // otherwise a failed log leaves the user charged with nothing to show
      // in the dashboard or the admin transactions list.
      const purchaseRef = userRef.collection("purchases").doc();
      tx.set(purchaseRef, {
        game: game.name,
        gameSlug: game.slug,
        amount: totalCoins,
        image: game.image,
        timestamp: FieldValue.serverTimestamp(),
        creatorCode: data.creatorCode ?? null,
        isFreeBonus: false,
        usdValue: 0,
        paymentMethod: "manual",
        packCoins,
        quantity,
        country: typeof country === "string" ? country.slice(0, 40) : null,
        notes: typeof notes === "string" ? notes.slice(0, MAX_NOTES_LENGTH) : "",
      });

      tx.update(userRef, { coins: FieldValue.increment(-totalCoins) });

      return balance - totalCoins;
    });

    return NextResponse.json({ success: true, coinsSpent: totalCoins, remainingCoins });
  } catch (e) {
    if (e instanceof InsufficientCoinsError) {
      return NextResponse.json(
        { error: "Not enough coins", balance: e.balance, required: totalCoins },
        { status: 409 }
      );
    }
    const message = e instanceof Error ? e.message : "Purchase failed";
    console.error("[purchase] failed to record order", { uid, slug, packIndex, quantity, message });
    return NextResponse.json({ error: "Could not place the order. Please try again." }, { status: 500 });
  }
}
