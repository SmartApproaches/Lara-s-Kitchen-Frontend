import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Alert, Skeleton } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import {
  clientSession,
  useMyAdChartQuery,
  useMyAdMetricsQuery,
  useMyAdQuery,
} from "../../redux/api/adClientApi";
import { AdStateLabel } from "../admin/_pages/business-suite/ads/AdComponents";
import {
  AdMetricCards,
  AdMetricsChart,
  AdPreview,
  InfoRow,
} from "../admin/_pages/business-suite/ads/AdMetrics";
import { formatAdDate } from "../admin/_pages/business-suite/ads/adUtils";
import ClientShell from "./ClientShell";
import useSignOut from "./useSignOut";
import { CLIENT_LABELS } from "./clientLabels";

// /advertisers/:id: one of the client's ads, read-only.
const AdvertiserAdView = ({ id, session }) => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("7d");
  const signOut = useSignOut(() => navigate("/advertisers"));

  const { data: ad, isLoading, error } = useMyAdQuery(id);
  const { data: metrics, isLoading: isLoadingMetrics } = useMyAdMetricsQuery(id, { skip: !ad });
  const { data: chart, isFetching: isFetchingChart } = useMyAdChartQuery(
    { id, period },
    { skip: !ad },
  );

  return (
    <ClientShell email={session.client_email} onSignOut={signOut}>
      <Link
        to="/advertisers"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#157F3B] hover:underline"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        All your ads
      </Link>

      {isLoading && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      )}

      {!isLoading && (error || !ad) && (
        <Alert
          type="error"
          showIcon
          message={error?.data?.message || "Advert not found"}
          description="It may have been removed. Go back to see all your ads."
        />
      )}

      {ad && (
        <>
          <h1 className="mb-6 text-2xl font-bold text-[#2A3A25] sm:text-3xl">{ad.title}</h1>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <AdPreview ad={ad} />

            <div className="rounded-2xl bg-white p-5 shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#2A3A25]">Details</h2>
                <AdStateLabel ad={ad} />
              </div>
              <div className="divide-y divide-gray-100">
                <InfoRow label="Starts">{formatAdDate(ad.start_date)}</InfoRow>
                <InfoRow label="Ends">{formatAdDate(ad.end_date)}</InfoRow>
                {ad.link_url && (
                  <InfoRow label="Link">
                    <a
                      href={ad.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#157F3B] underline"
                    >
                      {ad.link_url}
                    </a>
                  </InfoRow>
                )}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Times are UK time. To change or stop this ad, contact Lara&apos;s Kitchen.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <AdMetricCards
              metrics={metrics ?? ad}
              loading={isLoadingMetrics}
              labels={CLIENT_LABELS}
            />
          </div>

          <AdMetricsChart
            data={chart}
            period={period}
            onPeriodChange={setPeriod}
            fetching={isFetchingChart}
            labels={CLIENT_LABELS}
          />
        </>
      )}
    </ClientShell>
  );
};

const AdvertiserAd = () => {
  const { id } = useParams();
  const session = clientSession.get();
  if (!session) return <Navigate to="/advertisers" replace />;
  return <AdvertiserAdView id={id} session={session} />;
};

export default AdvertiserAd;
