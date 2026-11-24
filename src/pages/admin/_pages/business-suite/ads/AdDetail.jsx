import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Modal, Skeleton } from "antd";
import toast from "react-hot-toast";
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
import { AdMetricCards, AdMetricsChart, AdPreview, InfoRow } from "./AdMetrics";

// When the client was emailed about this ad (null until then).
const emailedAt = (value) =>
  value ? formatAdDate(value) : <span className="font-normal text-gray-400">Not yet</span>;

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
        <AdPreview ad={ad} />

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

          {/* Whether the client was told (emails are sent automatically) */}
          <h3 className="mt-4 mb-1 text-sm font-semibold text-[#2A3A25]">Client emails</h3>
          <div className="divide-y divide-gray-100">
            <InfoRow label="Told it's booked">{emailedAt(ad.booked_emailed_at)}</InfoRow>
            <InfoRow label="Told it's live">{emailedAt(ad.live_emailed_at)}</InfoRow>
            <InfoRow label="Sent final numbers">{emailedAt(ad.ended_emailed_at)}</InfoRow>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <AdMetricCards metrics={metrics} loading={isLoadingMetrics} />
      </div>

      {/* Chart */}
      <AdMetricsChart
        data={chart}
        period={period}
        onPeriodChange={setPeriod}
        fetching={isFetchingChart}
      />
    </div>
  );
};

export default AdDetail;
