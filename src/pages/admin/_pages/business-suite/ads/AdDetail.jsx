import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Modal, Skeleton } from "antd";
import toast from "react-hot-toast";
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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  PlayCircleIcon,
  StopCircleIcon,
} from "@hugeicons/core-free-icons";

import {
  useDeleteAdvertMutation,
  useDuplicateAdvertMutation,
  useGetAdvertChartQuery,
  useGetAdvertMetricsQuery,
  useGetAdvertQuery,
  useResumeAdvertMutation,
  useStopAdvertMutation,
} from "../../../../../redux/slices/super-admin/adsApiSlice";
import { AdStateLabel, PageHeader } from "./AdComponents";
import { ADS_BASE, errorMessage, formatAdDate } from "./adUtils";

const PERIODS = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "12m", label: "12 months" },
];

const IMPRESSIONS_COLOR = "#1F5226";
const CLICKS_COLOR = "#F5AB0A";

// "2026-11-19" (daily) or "2026-11" (monthly)
const formatChartDate = (value) =>
  /^\d{4}-\d{2}$/.test(value) ? dayjs(`${value}-01`).format("MMM YY") : dayjs(value).format("D MMM");

const MetricCard = ({ title, value, loading }) => (
  <div className="rounded-xl bg-white p-5 shadow-md">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    {loading ? (
      <Skeleton.Input active size="small" className="mt-2" />
    ) : (
      <p className="mt-1 text-3xl font-bold text-[#1F5226]">{value}</p>
    )}
  </div>
);

const InfoRow = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium break-all text-[#2A3A25]">{children}</span>
  </div>
);

const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("7d");

  const { data: adRes, isLoading, error } = useGetAdvertQuery(id);
  const { data: metricsRes, isLoading: isLoadingMetrics } = useGetAdvertMetricsQuery(id);
  const { data: chartRes, isFetching: isFetchingChart } = useGetAdvertChartQuery({ id, period });

  const [duplicateAdvert, { isLoading: isDuplicating }] = useDuplicateAdvertMutation();
  const [stopAdvert, { isLoading: isStopping }] = useStopAdvertMutation();
  const [resumeAdvert, { isLoading: isResuming }] = useResumeAdvertMutation();
  const [deleteAdvert, { isLoading: isDeleting }] = useDeleteAdvertMutation();

  const ad = adRes?.data;
  const metrics = metricsRes?.data;
  const chart = Array.isArray(chartRes?.data) ? chartRes.data : [];
  const busy = isDuplicating || isStopping || isResuming || isDeleting;

  const run = async (action, success, fallback) => {
    try {
      const res = await action();
      toast.success(res?.message || success);
      return res;
    } catch (err) {
      toast.error(errorMessage(err, fallback));
      return null;
    }
  };

  const handleDuplicate = async () => {
    const res = await run(
      () => duplicateAdvert(id).unwrap(),
      "Ad duplicated",
      "Failed to duplicate the ad",
    );
    if (res?.data?.id) navigate(`${ADS_BASE}/${res.data.id}`);
  };

  const handleStop = () =>
    run(() => stopAdvert(id).unwrap(), "Ad stopped", "Failed to stop the ad");

  const handleResume = () =>
    run(() => resumeAdvert(id).unwrap(), "Ad resumed", "Failed to resume the ad");

  const handleDelete = () =>
    Modal.confirm({
      title: "Delete this ad?",
      content: "It will be taken off the dashboard and the app. This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        const res = await run(
          () => deleteAdvert(id).unwrap(),
          "Ad deleted",
          "Failed to delete the ad",
        );
        if (res) navigate(ADS_BASE);
      },
    });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Ad" backTo={ADS_BASE} />
        <div className="rounded-xl bg-white p-6 shadow-md">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div>
        <PageHeader title="Ad" backTo={ADS_BASE} />
        <Alert type="error" showIcon message={errorMessage(error, "Failed to load the ad")} />
      </div>
    );
  }

  const isActive = ad.status === "active";
  const canResume = ad.status === "stopped" || ad.status === "paused";

  return (
    <div>
      <PageHeader title={ad.title} backTo={ADS_BASE}>
        <Button
          icon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
          disabled={busy}
          onClick={() => navigate(`${ADS_BASE}/${id}/edit`)}
        >
          Edit
        </Button>
        <Button
          icon={<HugeiconsIcon icon={Copy01Icon} size={16} />}
          loading={isDuplicating}
          disabled={busy}
          onClick={handleDuplicate}
        >
          Duplicate
        </Button>
        {isActive && (
          <Button
            icon={<HugeiconsIcon icon={StopCircleIcon} size={16} />}
            loading={isStopping}
            disabled={busy}
            onClick={handleStop}
          >
            Stop
          </Button>
        )}
        {canResume && (
          <Button
            icon={<HugeiconsIcon icon={PlayCircleIcon} size={16} />}
            loading={isResuming}
            disabled={busy}
            onClick={handleResume}
          >
            Resume
          </Button>
        )}
        <Button
          danger
          icon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
          loading={isDeleting}
          disabled={busy}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* The advert as the app shows it */}
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

        {/* Client, dates and state */}
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#2A3A25]">Details</h3>
            <AdStateLabel ad={ad} />
          </div>
          <div className="divide-y divide-gray-100">
            <InfoRow label="Client">{ad.client_name || "—"}</InfoRow>
            <InfoRow label="Client email">{ad.client_email || "—"}</InfoRow>
            <InfoRow label="Starts">{formatAdDate(ad.start_date)}</InfoRow>
            <InfoRow label="Ends">{formatAdDate(ad.end_date)}</InfoRow>
            <InfoRow label="Link">
              {ad.link_url ? (
                <a
                  href={ad.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#157F3B] underline"
                >
                  {ad.link_url}
                </a>
              ) : (
                "—"
              )}
            </InfoRow>
            <InfoRow label="Created">{formatAdDate(ad.created_at)}</InfoRow>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Impressions"
          value={Number(metrics?.impressions ?? 0).toLocaleString()}
          loading={isLoadingMetrics}
        />
        <MetricCard
          title="Clicks"
          value={Number(metrics?.clicks ?? 0).toLocaleString()}
          loading={isLoadingMetrics}
        />
        <MetricCard
          title="Click-through rate"
          value={`${Number(metrics?.ctr ?? 0).toFixed(2)}%`}
          loading={isLoadingMetrics}
        />
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h3 className="text-base font-semibold text-[#2A3A25]">Impressions and clicks</h3>
          <div className="flex gap-1 rounded-full bg-[#D6FADB] p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  period === p.id ? "bg-white text-[#1F5226] shadow-sm" : "text-gray-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`h-72 w-full transition-opacity ${isFetchingChart ? "opacity-50" : ""}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
                name="Impressions"
                stroke={IMPRESSIONS_COLOR}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke={CLICKS_COLOR}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
