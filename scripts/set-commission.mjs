#!/usr/bin/env node
// One-off: set commissionPct = 0.05 (5%) on every creatorCodes doc.
// Usage: node scripts/set-commission.mjs [--dry-run]
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const NEW_PCT = 0.05;
const dryRun = process.argv.includes("--dry-run");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  env[m[1]] = v;
}

initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();
const snap = await db.collection("creatorCodes").get();

if (snap.empty) {
  console.log("No creatorCodes docs found.");
  process.exit(0);
}

for (const doc of snap.docs) {
  const current = doc.data().commissionPct ?? 0;
  if (current === NEW_PCT) {
    console.log(`${doc.id}: already ${NEW_PCT} — unchanged`);
    continue;
  }
  console.log(`${doc.id}: ${current} -> ${NEW_PCT}${dryRun ? " (dry run, not written)" : ""}`);
  if (!dryRun) {
    await doc.ref.update({ commissionPct: NEW_PCT });
  }
}

console.log(dryRun ? "Dry run complete — nothing was written." : "Done.");
