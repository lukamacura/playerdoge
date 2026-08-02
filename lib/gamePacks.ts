// Coin cost of each in-game pack tier, shared by the game page and the
// server route that charges for it so the price cannot be set by the client.
export const GAME_PACK_COINS = [100, 500, 1000, 2000, 5000, 10000] as const;

export const MAX_PURCHASE_QUANTITY = 50;

export function isPackIndex(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= 0 && (v as number) < GAME_PACK_COINS.length;
}
