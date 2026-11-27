// Keeps the house / flat number in UK addresses picked from Google Places.
// Google often resolves a UK suggestion to street or postcode level and drops the
// number from formatted_address, so we take it from what was typed and put it back.
// (Same rules as the LKA mobile app's utils/address.ts.)

/**
 * Leading house / flat number from typed text:
 * "34 Otto Terrace" → "34", "12A, High St" → "12A",
 * "Flat 3, 34 Otto Terrace" → "Flat 3, 34", "10-12 Market St" → "10-12".
 */
export function extractHouseNumber(text) {
  if (!text) return null;
  const match = String(text).match(
    /^\s*((?:flat|apartment|apt|unit|suite)\.?\s*[\w-]+\s*,?\s*)?(\d+[a-z]?(?:\s*[-/]\s*\d+[a-z]?)?)(?=[\s,]|$)/i,
  );
  if (!match) return null;
  const flat = match[1] ? match[1].replace(/[\s,]+$/, "") : "";
  const number = match[2].replace(/\s+/g, "");
  return flat ? `${flat}, ${number}` : number;
}

/** street_number (with any subpremise) from a Google place, if Google has it. */
export function getGoogleHouseNumber(place) {
  const components = place?.address_components ?? place?.addressComponents ?? [];
  if (!Array.isArray(components)) return null;
  const find = (type) => components.find((c) => Array.isArray(c?.types) && c.types.includes(type));
  const value = (c) => c?.long_name ?? c?.longText ?? c?.short_name ?? c?.shortText;
  const sub = find("subpremise");
  const num = find("street_number") ?? find("premise");
  const parts = [sub && value(sub), num && value(num)].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

/** Puts the house number into the address line when it's missing. */
export function applyHouseNumber(address, houseNumber) {
  const number = houseNumber?.trim();
  if (!number || !address) return address;

  const escaped = number.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`(^|[\\s,])${escaped}(?=[\\s,]|$)`, "i").test(address)) return address;

  const [firstPart] = address.split(",");
  const startsWithStreet =
    /\b(road|rd|street|st|terrace|avenue|ave|lane|ln|close|drive|dr|way|place|pl|court|ct|crescent|grove|gardens|gdns|square|sq|row|walk|hill|park|view|mews|parade|green|rise)\.?$/i.test(
      firstPart.trim(),
    );
  return startsWithStreet ? `${number} ${address}` : `${number}, ${address}`;
}
