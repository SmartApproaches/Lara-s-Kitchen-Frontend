// Shared by the admin ad detail page and the advertisers' (client) page.
import { Skeleton } from "antd";
import dayjs from "dayjs";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PERIODS = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "12m", label: "12 months" },
];

const IMPRESSIONS_COLOR = "#1F5226";
const CLICKS_COLOR = "#F5AB0A";

// Admin words by default; the client page passes { impressions: "Views", clicks: "Taps", ctr: "Tap rate" }.
const DEFAULT_LABELS = {
  impressions: "Impressions",
  clicks: "Clicks",
  ctr: "Click-through rate",
};

// "2026-11-19" (daily) or "2026-11" (monthly)
const formatChartDate = (value) =>
  /^\d{4}-\d{2}$/.test(value)
    ? dayjs(`${value}-01`).format("MMM YY")
    : dayjs(value).format("D MMM");

const formatCtr = (ctr) =>
  `${Number(ctr ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

export const MetricCard = ({ title, value, loading }) => (
  <div className="rounded-xl bg-white p-5 shadow-md">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    {loading ? (
      <Skeleton.Input active size="small" className="mt-2" />
    ) : (
      <p className="mt-1 text-3xl font-bold text-[#1F5226]">{value}</p>
    )}
  </div>
);

// metrics: { impressions, clicks, ctr }
export const AdMetricCards = ({ metrics, loading, labels = DEFAULT_LABELS }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <MetricCard
      title={labels.impressions}
      value={Number(metrics?.impressions ?? 0).toLocaleString()}
      loading={loading}
    />
    <MetricCard
      title={labels.clicks}
      value={Number(metrics?.clicks ?? 0).toLocaleString()}
      loading={loading}
    />
    <MetricCard title={labels.ctr} value={formatCtr(metrics?.ctr)} loading={loading} />
  </div>
);

// data: [{ date, impressions, clicks }], oldest first
export const AdMetricsChart = ({
  data,
  period,
  onPeriodChange,
  fetching,
  labels = DEFAULT_LABELS,
}) => (
  <div className="rounded-2xl bg-white p-5 shadow-md">
    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <h3 className="text-base font-semibold text-[#2A3A25]">
        {labels.impressions} and {labels.clicks.toLowerCase()}
      </h3>
      <div className="flex gap-1 self-start rounded-full bg-[#D6FADB] p-1">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPeriodChange(p.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              period === p.id ? "bg-white text-[#1F5226] shadow-sm" : "text-gray-600"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>

    <div className={`h-72 w-full transition-opacity ${fetching ? "opacity-50" : ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={Array.isArray(data) ? data : []}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartDate}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            minTickGap={16}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip labelFormatter={formatChartDate} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="impressions"
            name={labels.impressions}
            stroke={IMPRESSIONS_COLOR}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            name={labels.clicks}
            stroke={CLICKS_COLOR}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// The advert as the app shows it: picture, title, description and button.
export const AdPreview = ({ ad }) => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-md">
    {ad.image_url && (
      <img src={ad.image_url} alt={ad.title} className="aspect-[16/10] w-full object-cover" />
    )}
    <div className="p-4">
      <h2 className="text-lg font-bold text-[#2A3A25]">{ad.title}</h2>
      {ad.description && <p className="mt-1 text-sm text-gray-600">{ad.description}</p>}
      {ad.call_to_action_text && (
        <a
          href={ad.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-[#1F5226] px-5 py-2 text-sm font-semibold !text-white"
        >
          {ad.call_to_action_text}
        </a>
      )}
    </div>
  </div>
);

export const InfoRow = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium break-all text-[#2A3A25]">{children}</span>
  </div>
);
