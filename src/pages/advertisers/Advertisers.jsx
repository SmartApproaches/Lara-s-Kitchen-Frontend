import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Skeleton } from "antd";

import { clientSession, useMyAdsQuery } from "../../redux/api/adClientApi";
import { AdStateLabel } from "../admin/_pages/business-suite/ads/AdComponents";
import { AdMetricCards } from "../admin/_pages/business-suite/ads/AdMetrics";
import { formatAdDate } from "../admin/_pages/business-suite/ads/adUtils";
import ClientShell from "./ClientShell";
import SignIn from "./SignIn";
import useSignOut from "./useSignOut";
import { CLIENT_LABELS, formatCtr } from "./clientLabels";

const Stat = ({ label, value }) => (
  <div className="text-right">
    <p className="text-[11px] text-gray-500">{label}</p>
    <p className="text-sm font-bold text-[#1F5226]">{value}</p>
  </div>
);

const MyAds = ({ session, onSignOut }) => {
  const { data, isLoading, error } = useMyAdsQuery();
  const ads = data?.adverts ?? [];

  return (
    <ClientShell email={session.client_email} onSignOut={onSignOut}>
      <h1 className="text-2xl font-bold text-[#2A3A25] sm:text-3xl">
        {data?.client_name ? `${data.client_name}'s ads` : "Your ads"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {data
          ? `${data.total_adverts ?? ads.length} ad${(data.total_adverts ?? ads.length) === 1 ? "" : "s"} with Lara's Kitchen`
          : " "}
      </p>

      {error ? (
        <Alert
          className="!mt-6"
          type="error"
          showIcon
          message={error?.data?.message || "We couldn't load your ads. Please try again."}
        />
      ) : (
        <>
          <div className="mt-6">
            <AdMetricCards metrics={data?.totals} loading={isLoading} labels={CLIENT_LABELS} />
          </div>

          <div className="mt-6 space-y-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white p-4 shadow-md">
                  <Skeleton active avatar={{ shape: "square", size: 64 }} paragraph={{ rows: 1 }} />
                </div>
              ))}

            {!isLoading && ads.length === 0 && (
              <p className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-md">
                You don&apos;t have any ads yet.
              </p>
            )}

            {ads.map((ad) => (
              <Link
                key={ad.id}
                to={`/advertisers/${ad.id}`}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {ad.image_url ? (
                    <img
                      src={ad.image_url}
                      alt=""
                      className="h-16 w-24 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-24 flex-shrink-0 rounded-lg bg-gray-100" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#2A3A25]">{ad.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatAdDate(ad.start_date)} → {formatAdDate(ad.end_date)}
                    </p>
                    <div className="mt-1">
                      <AdStateLabel ad={ad} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  <Stat
                    label={CLIENT_LABELS.impressions}
                    value={Number(ad.impressions ?? 0).toLocaleString()}
                  />
                  <Stat
                    label={CLIENT_LABELS.clicks}
                    value={Number(ad.clicks ?? 0).toLocaleString()}
                  />
                  <Stat label={CLIENT_LABELS.ctr} value={formatCtr(ad.ctr)} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </ClientShell>
  );
};

// /advertisers: sign in (email, then code), then the client's ads.
const Advertisers = () => {
  const [session, setSession] = useState(() => clientSession.get());
  const signOut = useSignOut(() => setSession(null));

  if (!session) {
    return (
      <ClientShell>
        <SignIn onSignedIn={setSession} />
      </ClientShell>
    );
  }

  return <MyAds session={session} onSignOut={signOut} />;
};

export default Advertisers;
