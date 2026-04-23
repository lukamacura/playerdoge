export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { creditPurchase } from "@/lib/creditPurchase";

export async function POST(request: Request) {
  const { uid, coinAmount, usdValue = 0, game = "Coin Purchase" } = await request.json();

  if (!uid || !coinAmount || coinAmount <= 0) {
    return NextResponse.json({ error: "uid and coinAmount are required" }, { status: 400 });
  }

  try {
    await creditPurchase({ uid, coinAmount, usdValue, game });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    const status = message === "User not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ success: true });
}
