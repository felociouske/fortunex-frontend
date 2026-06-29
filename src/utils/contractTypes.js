/**
 * Mirrors backend trading/contract_types.py -- the canonical list and
 * unlock order of all 6 contract types. Kept here as plain data (not
 * fetched from the API) since it's truly static; only the user's
 * unlocked SUBSET changes, which comes from tradingAPI.getMyTier().
 */
export const CONTRACT_TYPES = [
  { code: "RISE_FALL", label: "Rise/Fall", short: "Predict if price rises or falls" },
  { code: "EVEN_ODD", label: "Even/Odd", short: "Predict the last digit's parity" },
  { code: "HIGHER_LOWER", label: "Higher/Lower", short: "Predict price vs a barrier" },
  { code: "OVER_UNDER", label: "Over/Under", short: "Predict last digit vs a chosen digit" },
  { code: "MATCHES_DIFFERS", label: "Matches/Differs", short: "Predict if the last digit matches" },
  { code: "TOUCH_NO_TOUCH", label: "Touch/No Touch", short: "Predict if price touches a barrier" },
];

export const CONTRACT_LABELS = Object.fromEntries(CONTRACT_TYPES.map((c) => [c.code, c.label]));