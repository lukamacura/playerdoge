export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

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

  const { code } = await request.json();
  const normalizedCode = (code as string)?.toUpperCase().trim();

  if (!normalizedCode) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const codeSnap = await adminDb.collection("creatorCodes").doc(normalizedCode).get();
  if (!codeSnap.exists || !codeSnap.data()?.active) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  if (codeSnap.data()?.creatorUid === uid) {
    return NextResponse.json({ error: "Cannot use your own code" }, { status: 400 });
  }

  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (userSnap.data()?.creatorCode) {
    return NextResponse.json({ error: "Code already applied" }, { status: 409 });
  }

  await userRef.update({
    creatorCode: normalizedCode,
    creatorCodeAppliedAt: FieldValue.serverTimestamp(),
    freePackageStatus: "pending",
  });

  return NextResponse.json({ success: true, displayName: codeSnap.data()?.displayName });
}
