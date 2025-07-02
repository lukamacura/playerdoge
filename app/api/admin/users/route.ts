export const runtime = "nodejs";

import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const snapshot = await adminDb.collection("users").get();
  const users = snapshot.docs.map(doc => ({
    uid: doc.id,
    email: doc.data().email,
    coins: doc.data().coins,
  }));
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { uid, coins } = await request.json();
  await adminDb.collection("users").doc(uid).update({ coins });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { uid } = await request.json();
  await adminAuth.deleteUser(uid);
  await adminDb.collection("users").doc(uid).delete();
  return NextResponse.json({ success: true });
}
