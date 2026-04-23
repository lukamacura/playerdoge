export const PACKS = {
  "usd-2000": { coinAmount: 2000, usdValue: 17.99 },
  "usd-5000": { coinAmount: 5000, usdValue: 43.99 },
  "usd-10000": { coinAmount: 10000, usdValue: 87.99 },
  "usd-100000": { coinAmount: 100000, usdValue: 879.99 },
} as const;

export type PackId = keyof typeof PACKS;

export function isPackId(v: unknown): v is PackId {
  return typeof v === "string" && v in PACKS;
}
