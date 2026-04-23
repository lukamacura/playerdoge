# Paymento Crypto Payment Integration

## Context

The PlayerDoge site currently sells in-game coin packs via `/buycoins`, but the flow is **manual**: user picks a pack → `PaymentPopup` collects creator code → user picks a method (paypal/wise/zelle/etc.) → `useTidio` opens a chat with the purchase details → an admin manually runs `POST /api/admin/confirmPurchase` to credit coins.

We want to add **Paymento** (crypto gateway) as a **fully automated** option alongside the existing chat-based methods. When a user picks "Pay with Crypto", they're redirected to Paymento, pay with BTC/ETH/etc., and on confirmed payment a Paymento IPN webhook credits their coins automatically — reusing the existing referral/commission/free-bonus logic already living in `confirmPurchase`.

**Decisions already confirmed with user:**
- Add crypto as a **new tile** in the existing `PaymentPopup` — other methods unchanged.
- Always send **USD** to Paymento (the site shows 5 currencies, but `usdValue` is the canonical figure for commission math).
- **Defer** admin-route auth hardening; the webhook won't call `/api/admin/*` over HTTP — instead, shared crediting logic is extracted into a server-side helper that both the webhook and the existing admin route call directly.

## Architecture

```
User clicks "Pay with Crypto" in PaymentPopup
  └─ POST /api/payment/create  (Firebase ID token auth)
       ├─ derives usdValue + coinAmount from the requested pack (server-side map, not trusted client)
       ├─ writes pendingPayments/{token} doc { uid, coinAmount, usdValue, creatorCode snapshot, status: "initialized" }
       ├─ calls Paymento POST /v1/payment/request (fiatAmount, fiatCurrency: "USD", orderId, ReturnUrl, additionalData: [{uid},{coinAmount}])
       └─ returns { redirectUrl: "https://app.paymento.io/gateway?token=..." }
  └─ window.location = redirectUrl

User pays with crypto on Paymento

Paymento → POST /api/payment/callback   (IPN, configured in Paymento dashboard)
  ├─ read raw body, verify X-Hmac-Sha256-Signature with PAYMENTO_SECRET_KEY
  ├─ parse { Token, OrderId, OrderStatus, AdditionalData }
  ├─ look up pendingPayments/{token} (defense-in-depth against spoofed additionalData)
  ├─ if OrderStatus === 7 (Paid):
  │    ├─ call Paymento POST /v1/payment/verify with token → confirms on-chain
  │    ├─ run creditPurchase(uid, coinAmount, usdValue) — atomic, idempotent on pendingPayments.status
  │    └─ mark pendingPayments.status = "credited"
  ├─ log other statuses (Pending/PartialPaid/WaitingToConfirm/Timeout/UserCanceled/Reject) onto the pending doc
  └─ always return 200 (so Paymento doesn't retry-storm a benign status)

Paymento also redirects user browser to ReturnUrl → /buycoins/success?token=...
  └─ shows "Payment received, coins will appear shortly" + polls /api/payment/status?token=... until credited
```

## Files to create / modify

### New: `lib/paymento.ts`
Thin server-side Paymento client + HMAC helper. Keep all HTTP details here so routes stay small.
- `createPaymentRequest({ fiatAmount, fiatCurrency, orderId, returnUrl, additionalData, email })` → returns token
- `verifyPayment(token)` → returns the verified order body
- `verifyHmac(rawBody, receivedSignature)` → boolean, using `crypto.createHmac('sha256', secret).update(rawBody).digest('hex').toUpperCase()`
- Reads `PAYMENTO_API_KEY` and `PAYMENTO_SECRET_KEY` from env.

### New: `lib/creditPurchase.ts`
Extract the entire `adminDb.runTransaction(...)` block currently inside `app/api/admin/confirmPurchase/route.ts` (lines 15–82) into a reusable function:
```ts
export async function creditPurchase(opts: {
  uid: string;
  coinAmount: number;
  usdValue?: number;
  game?: string;
}): Promise<void>
```
No behaviour change — same referral/commission/free-bonus handling.

### Modify: `app/api/admin/confirmPurchase/route.ts`
Replace the inline transaction with `await creditPurchase({ uid, coinAmount, usdValue, game })`. Keeps current callers working.

### New: `app/api/payment/create/route.ts`
- `runtime = "nodejs"`, `dynamic = "force-dynamic"`.
- Auth: verify Firebase ID token from `Authorization: Bearer ...` via `adminAuth.verifyIdToken` (same pattern as `app/api/referral/apply/route.ts` line 16).
- Body: `{ packId: "usd-2000" | "usd-5000" | "usd-10000" | "usd-100000" }` — **do NOT trust a client-sent price**. Server holds the canonical map:
  ```ts
  const PACKS = {
    "usd-2000":   { coinAmount: 2000,   usdValue: 17.99 },
    "usd-5000":   { coinAmount: 5000,   usdValue: 43.99 },
    "usd-10000":  { coinAmount: 10000,  usdValue: 87.99 },
    "usd-100000": { coinAmount: 100000, usdValue: 879.99 },
  };
  ```
  (Numbers taken from `app/buycoins/page.tsx` USD row, lines 20–25.)
- `orderId = \`pd-\${uid}-\${Date.now()}\``.
- Call `createPaymentRequest` with `fiatAmount: String(pack.usdValue)`, `fiatCurrency: "USD"`, `orderId`, `returnUrl: \`\${SITE_URL}/buycoins/success\``, `additionalData: [{key:"uid",value:uid},{key:"packId",value:packId}]`, `email: decodedToken.email`.
- Receive `token` from Paymento → write `pendingPayments/{token}`:
  ```ts
  { uid, packId, coinAmount, usdValue, orderId,
    createdAt: serverTimestamp(), status: "initialized", paymentoToken: token }
  ```
- Return `{ redirectUrl: \`https://app.paymento.io/gateway?token=\${token}\` }`.

### New: `app/api/payment/callback/route.ts`
- `runtime = "nodejs"`, `dynamic = "force-dynamic"`.
- Read raw body via `await request.text()` **before** JSON-parsing (HMAC is over the raw bytes).
- Verify signature header `X-Hmac-Sha256-Signature`; 401 on mismatch. **Do not early-return on unknown tokens** until HMAC passes (avoids token-probing).
- Parse body → `{ Token, OrderId, OrderStatus, AdditionalData }`.
- `tx` on `pendingPayments/{Token}`:
  - If doc missing → log + 200 (don't retry).
  - If already `status === "credited"` → 200 (idempotent).
  - If `OrderStatus === 7`: call `verifyPayment(Token)`; if it returns success, `creditPurchase({ uid, coinAmount, usdValue, game: "Coin Purchase" })`, then set `status: "credited"`, `creditedAt`.
  - Else: append status + timestamp to `statusLog[]` on the pending doc.
- Always respond 200 on authenticated requests.

### New: `app/api/payment/status/route.ts` (small, for the success page to poll)
- GET `?token=...`, auth by Firebase ID token.
- Returns `{ status, coinAmount }` from `pendingPayments/{token}` **only if** doc's `uid` matches caller.

### Modify: `components/PaymentPopup.tsx`
- Add a new logical method `"crypto"` with its own tile (distinct from the current 8 icons — put it at the top with a short "Instant, no account needed" caption).
- When user selects crypto, don't call the parent `onSelect`. Instead, call a new prop `onCryptoSelect(packId)` — or internally POST to `/api/payment/create` and redirect. **Preferred**: pass a new `onCryptoSelect` prop so `buycoins/page.tsx` owns the fetch and can pass the correct `packId`.

### Modify: `app/buycoins/page.tsx`
- Add `packId` to each USD entry in `priceData` (or maintain a parallel map keyed by USD amount). Only USD packs are eligible for crypto in v1 — if the user has EUR/CAD/AUD/GBP selected, the crypto tile is disabled with a tooltip "Crypto payments are billed in USD — switch to USD to use".
- Handle `onCryptoSelect`: `await fetch('/api/payment/create', { method: 'POST', headers: { Authorization: \`Bearer \${await user.getIdToken()}\` }, body: JSON.stringify({ packId }) })` → `window.location.href = redirectUrl`.
- Loading state while the request is in flight.

### New: `app/buycoins/success/page.tsx`
Client page, reads `?token=`, polls `/api/payment/status` every 3s until `status === "credited"` (or timeout 5 min), shows confirmation + "Go to dashboard" CTA. On timeout, show "Your payment is still being confirmed on the blockchain — check your dashboard shortly."

### New: `app/buycoins/cancel/page.tsx`
Static, "Payment canceled — nothing was charged", link back to `/buycoins`. (Used if Paymento sends user back with a canceled status.)

### Modify: `.env.local` (and `.env.example` if present)
Add:
```
PAYMENTO_API_KEY=
PAYMENTO_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=https://playerdoge.com
```

### Paymento dashboard (manual, one-time, not code)
After deploy: use Paymento's Set Payment Settings API (or dashboard UI) to set IPN URL to `https://playerdoge.com/api/payment/callback`. Document this step in the PR description.

## Firestore additions

New top-level collection `pendingPayments/{paymentoToken}`:
```
{
  uid: string,
  packId: string,
  coinAmount: number,
  usdValue: number,
  orderId: string,                 // pd-<uid>-<ts>
  paymentoToken: string,
  status: "initialized" | "credited" | "failed",
  statusLog: [{ code: number, at: Timestamp }],
  createdAt: Timestamp,
  creditedAt?: Timestamp
}
```
No changes to `users/{uid}` or `creatorCodes/{code}` schemas — `creditPurchase` writes exactly what the admin route writes today.

## Reused existing code (don't duplicate)

- Firebase Admin: `lib/firebaseAdmin.ts` (`adminAuth`, `adminDb`) — already imported by `app/api/admin/confirmPurchase/route.ts` and `app/api/referral/apply/route.ts`.
- Token verification pattern: `app/api/referral/apply/route.ts:16` — copy the `authorization.split(' ')[1]` → `verifyIdToken` shape.
- Referral/commission/free-bonus logic: existing transaction block in `app/api/admin/confirmPurchase/route.ts:15-82` — lifted wholesale into `lib/creditPurchase.ts`, no behaviour change.
- Auth context on the client: `context/AuthContext.tsx` already exposes `user`/`userData`; use `user.getIdToken()` like `components/PaymentPopup.tsx:52` and `CoinCard.tsx`.

## Security notes

- **Never trust client-sent prices.** `packId` → server map. If an unknown packId arrives, reject.
- **HMAC on raw bytes.** Use `request.text()` then hash, don't stringify after parsing.
- **Double-verify.** A "Paid" IPN always triggers a `/v1/payment/verify` call before crediting — per Paymento docs ("Always Verify Payments").
- **Idempotency.** `pendingPayments.status === "credited"` short-circuits re-credit if Paymento ever re-delivers the IPN.
- **API key** only in server-side routes (no `NEXT_PUBLIC_` prefix).

## Verification plan

1. **Dev env**: `npm run dev`, set `PAYMENTO_API_KEY` + `PAYMENTO_SECRET_KEY` from a Paymento **test/sandbox** merchant account.
2. **Tunnel** the local callback with a temporary public URL (ngrok / cloudflared) and register it via Paymento's Set Payment Settings — the IPN must be reachable.
3. **Happy path**: log in, click a USD pack → "Pay with Crypto" → confirm redirect lands on `app.paymento.io/gateway?token=...` → pay with the sandbox coin → confirm IPN fires, `pendingPayments/{token}.status` flips to `credited`, `users/{uid}.coins` increments by the pack amount, a new `purchases` doc appears in the user's subcollection.
4. **Referral path**: apply a creator code first (existing flow), repeat #3 → confirm `creatorCodes/{code}.totalReferredRevenueUSD` increments by `usdValue * commissionPct`, and — if `freePackageStatus` was `pending` — user gets +500 bonus and `totalReferredUsers` increments. Matches current manual confirmPurchase behaviour.
5. **Cancel path**: start a payment, cancel on Paymento → confirm `pendingPayments/{token}.statusLog` gets the cancel code, no coins credited.
6. **Replay safety**: manually re-POST the same IPN payload to `/api/payment/callback` → confirm second call is a no-op (status stays `credited`, coins don't double).
7. **Signature tamper**: re-POST with a changed body → confirm 401.
8. **Currency gate**: switch site currency to EUR → confirm the crypto tile disables with the "switch to USD" tooltip.
9. **Success page poll**: during step 3, observe the success page transitioning from "waiting" to "credited" state when the IPN lands.
10. **Dashboard**: verify the new purchase appears in `app/dashboard/page.tsx` list (no changes needed there — it reads `users/{uid}/purchases` which `creditPurchase` writes to).

## Out of scope (explicitly)

- Admin route auth hardening (deferred by user decision).
- EUR/CAD/AUD/GBP crypto billing (v1 is USD-only — tile disabled on other currencies).
- Refunds / partial payments UI (Paymento `PartialPaid` status is logged only; support handles case-by-case for now).
- Dynamic coin list via `/v1/payment/coins` — users pick coin on Paymento's page anyway.
