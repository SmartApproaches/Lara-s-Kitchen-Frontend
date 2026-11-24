// The words clients see (the emails use the same ones).
export const CLIENT_LABELS = {
  impressions: "Views",
  clicks: "Taps",
  ctr: "Tap rate",
};

export const formatCtr = (ctr) =>
  `${Number(ctr ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
