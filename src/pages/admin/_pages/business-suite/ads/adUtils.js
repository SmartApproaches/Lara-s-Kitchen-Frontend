import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const ADS_BASE = "/admin/business-suite/ads";

// State label as on the SmartEatX dashboard.
export const getAdState = (ad) => {
  if (!ad) return { label: "", bg: "#F3F4F6", color: "#4B5563" };
  if (ad.status === "completed") return { label: "Completed", bg: "#F3F4F6", color: "#4B5563" };
  if (ad.status === "stopped" || ad.status === "paused")
    return { label: "Ad stopped", bg: "#FEE2E2", color: "#B91C1C" };
  if (ad.start_date && dayjs(ad.start_date).isAfter(dayjs()))
    return { label: "Scheduled", bg: "#DCEBFF", color: "#1D5FBF" };

  const days =
    ad.days_left ?? Math.max(0, Math.ceil(dayjs(ad.end_date).diff(dayjs(), "day", true)));
  return { label: `${days} day${days === 1 ? "" : "s"} left`, bg: "#D6FADB", color: "#0CA921" };
};

// Ad times are shown in UK time, whatever the viewer's own time zone.
export const formatAdDate = (value) =>
  value ? dayjs(value).tz("Europe/London").format("D MMM YYYY, HH:mm") : "—";

export const errorMessage = (error, fallback) => error?.data?.message || fallback;

