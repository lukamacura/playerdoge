export const PACKS = {
  "usd-500": { coinAmount: 500, usdValue: 4.49 },
  "usd-1000": { coinAmount: 1000, usdValue: 8.99 },
  "usd-2000": { coinAmount: 2000, usdValue: 17.99 },
  "usd-5000": { coinAmount: 5000, usdValue: 44.99 },
  "usd-10000": { coinAmount: 10000, usdValue: 89.99 },
  "usd-20000": { coinAmount: 20000, usdValue: 179.99 },
} as const;

export type PackId = keyof typeof PACKS;

export function isPackId(v: unknown): v is PackId {
  return typeof v === "string" && v in PACKS;
}
