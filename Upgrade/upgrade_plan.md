# Kinged Referral Program — Architectural Feasibility Brief

## 1. Context Observations (stack audit)

Before proposing architecture, a few facts from the current repo meaningfully constrain the design:

- **Stack:** Next.js App Router + TypeScript + Firebase (Firestore via `firebaseAdmin`) — no Stripe/PayPal SDK, no webhook endpoints.
- **Checkout is manual:** `buycoins/page.tsx` hands off to `PaymentPopup` which forwards details to **Tidio chat** (`openChatWithMessage`). Payment is human-confirmed; coins are credited by an admin action, not an automated gateway.
- **Purchase ledger:** `users/{uid}/purchases` subcollection (seen in `app/api/admin/transactions/route.ts`).
- **Admin UI exists** (`app/admin/page.tsx`, `/api/admin/*`) — the natural place to surface creator attribution.

> **Implication:** Any "webhook-driven automation" spec is a misfit. The source of truth for "purchase completed" is the **admin confirming the sale** (or a server action the admin triggers). The free-package grant must hang off that same event.

---

## 2. Data Model

### 2.1 `creatorCodes/{codeId}` (new top-level collection)
```
{
  code: "MACURA"          // uppercased, unique, used as doc id
  creatorUid: string      // links to internal user if you want creator login later
  displayName: "Macura"
  commissionPct: 0.15     // optional, for admin reporting
  active: boolean
  createdAt: Timestamp
  totalReferredUsers: number   // denormalized counters
  totalReferredRevenueUSD: number
}
```

### 2.2 `users/{uid}` — new fields
```
creatorCode: string | null         // permanently attached once set
creatorCodeAppliedAt: Timestamp
freePackageStatus: "ineligible" | "pending" | "granted"
firstPurchaseAt: Timestamp | null  // cheap gate for "has paid"
```

### 2.3 `users/{uid}/purchases/{purchaseId}` — extend existing
```
creatorCode: string | null         // copy of user.creatorCode at time of txn
isFreeBonus: boolean               // true for the $5 reward grant
```

**Why denormalize `creatorCode` on each purchase:** lets the admin transaction view filter/group by creator without joins, and preserves attribution even if the code is later deactivated.

---

## 3. Eligibility State Machine (the core of the design)

```
ineligible  ──[user submits creatorCode pre-purchase]──►  pending
pending     ──[admin confirms first paid purchase]────►   granted (500-coin bonus purchase doc written)
granted     ──[any future state]──────────────────────►   (terminal)
```

- Code entry **does not** grant anything. It only flips `freePackageStatus: pending` and stamps `user.creatorCode`.
- The bonus is only minted at purchase confirmation time → **no refund loop risk**, because no coins were ever issued prematurely.
- Terminal `granted` state is the anti-abuse gate (see §6).

---

## 4. Backend Flow

Since there's no payment webhook, wire the grant into the **admin purchase confirmation path** (server action or admin API route — e.g., `POST /api/admin/confirmPurchase`):

1. Admin clicks "Mark paid" on the Tidio-surfaced order.
2. Server action runs a **Firestore transaction**:
   - Write the paid purchase doc into `users/{uid}/purchases`.
   - Increment coin balance.
   - If `user.freePackageStatus === "pending"` **and** this is the user's first paid purchase:
     - Write a second purchase doc `{ amount: 500, isFreeBonus: true, creatorCode }`.
     - Set `freePackageStatus: "granted"`, `firstPurchaseAt: now`.
     - Increment `creatorCodes/{code}.totalReferredUsers` (+1 once), `totalReferredRevenueUSD` (+txn value).
3. All writes atomic → partial failures can't mint free coins without a paid purchase.

**Code validation endpoint** (pre-purchase, lightweight): `GET /api/referral/validate?code=MACURA` → `{ valid, displayName }`. Rate-limit by IP + uid.

---

## 5. Frontend / UX

### 5.1 "Creator Code" input placement
Add to `PaymentPopup` (preferred — same modal the user already uses) or `buycoins/page.tsx` left column.

### 5.2 Conditional visibility (the "UI cleanup" requirement)
Drive purely from `user.creatorCode`:

```ts
const { creatorCode } = useUserDoc(); // one-shot Firestore listener via AuthContext
const showCodeInput = !creatorCode;
```

- If `creatorCode` is null → show input + "Apply" button.
- If set → render a compact read-only badge: `Referred by MACURA ✓` (or hide entirely).
- No need for local state juggling — Firestore is the source of truth, so the UI self-heals across tabs/devices.

### 5.3 Apply flow
`Apply` → `POST /api/referral/apply { code }` → server validates code + sets `user.creatorCode` + `freePackageStatus: "pending"` → client listener updates → input disappears. Toast: *"Code applied. Your free 500-coin package unlocks with your first purchase."*

---

## 6. Security & Abuse Surface

| Risk | Mitigation |
|---|---|
| User applies code, gets bonus, changes code to claim again | `freePackageStatus` is terminal at `granted`; `creatorCode` write is **one-time** (Firestore security rule: reject updates if field is non-null). |
| Multi-account farming (same person, many emails) | Throttle code applications per IP + email-verified gate before `pending`. Long-term: device fingerprint / payment-method fingerprint on first purchase. |
| Self-referral (creator buys under own code) | Server-side check: reject if `user.uid === creatorCodes[code].creatorUid`. |
| Enumerating valid codes | Rate-limit validation endpoint; return a generic `invalid` for unknown codes (no hints). |
| Admin double-credits | Idempotency key on the confirm action; the transaction in §4 guards state transitions. |
| Code deactivated mid-flight | Check `active: true` at both apply-time **and** grant-time. |
| Race: two concurrent first purchases | Firestore transaction on `users/{uid}` makes the "is first purchase" check atomic. |

**Firestore security rules to add:**
- `users/{uid}.creatorCode` writable by user only if current value is `null`.
- `freePackageStatus`, `firstPurchaseAt`, balance — admin-only writes.

---

## 7. Implementation Roadmap (ordered)

- **Phase 0 — schema:** add fields to `users`, create `creatorCodes` collection, seed first code manually.
- **Phase 1 — validation API:** `/api/referral/validate` + `/api/referral/apply` (server actions; no UI yet).
- **Phase 2 — Firestore rules:** lock down write paths per §6.
- **Phase 3 — UI:** add input to `PaymentPopup` driven by `user.creatorCode`; badge state for applied.
- **Phase 4 — admin confirm hook:** extend the existing "mark paid" path to run the transactional grant in §4.
- **Phase 5 — admin reporting:** extend `/api/admin/transactions` to group by `creatorCode`; new `/admin/creators` page with totals for payouts.
- **Phase 6 — hardening:** rate limits, self-referral guard, audit log collection `referralEvents` for disputes.

---

## 8. Open Questions Worth Deciding Before Coding

1. Does the free 500-coin package count toward the creator's commission, or is it excluded?
2. Should an existing paying user be able to *retroactively* attach a code (and forfeit the free package), or is the program new-customers-only?
3. Will creators eventually get a self-serve login/dashboard? If yes, `creatorUid` on `creatorCodes` should be populated now so you don't backfill later.
4. Automated Stripe/PayPal integration on the roadmap? If yes, plan the confirm hook in §4 as a **shared function** so a future webhook can call the same transaction.
