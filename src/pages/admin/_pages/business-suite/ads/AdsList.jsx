import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Input, Pagination, Skeleton, Table } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Search01Icon } from "@hugeicons/core-free-icons";

import {
  useGetAdvertStatsQuery,
  useGetAdvertsQuery,
} from "../../../../../redux/slices/super-admin/adsApiSlice";
import { AdStateLabel, PageHeader } from "./AdComponents";
import { ADS_BASE, errorMessage, formatAdDate } from "./adUtils";

const TABS = [
  { id: "", label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "stopped", label: "Stopped" },
  { id: "completed", label: "Completed" },
];

const PER_PAGE = 12;

const StatCard = ({ title, value, loading }) => (
  <div className="rounded-xl bg-white p-5 shadow-md">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    {loading ? (
      <Skeleton.Input active size="small" className="mt-2" />
    ) : (
      <p className="mt-1 text-3xl font-bold text-[#1F5226]">{value ?? 0}</p>
    )}
  </div>
);

const AdsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: statsRes, isLoading: isLoadingStats } = useGetAdvertStatsQuery();
  const { data, isLoading, isFetching, error } = useGetAdvertsQuery({ page, search, status });

  const stats = statsRes?.data;
  const list = data?.data;
  const ads = Array.isArray(list) ? list : (list?.data ?? []);
  const currentPage = list?.current_page ?? page;
  const lastPage = list?.last_page ?? 1;
  const total = list?.total ?? lastPage * PER_PAGE;

  const columns = [
    {
      title: "Picture",
      dataIndex: "image_url",
      key: "image",
      width: 90,
      render: (url, ad) =>
        url ? (
          <img src={url} alt={ad.title} className="h-12 w-16 rounded-lg object-cover" />
        ) : (
          <div className="h-12 w-16 rounded-lg bg-gray-100" />
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <span className="font-semibold text-[#2A3A25]">{title}</span>,
    },
    { title: "Client", dataIndex: "client_name", key: "client", render: (v) => v || "—" },
    {
      title: "Dates",
      key: "dates",
      render: (_, ad) => (
        <div className="text-xs whitespace-nowrap text-gray-600">
          <div>{formatAdDate(ad.start_date)}</div>
          <div>→ {formatAdDate(ad.end_date)}</div>
        </div>
      ),
    },
    { title: "State", key: "state", render: (_, ad) => <AdStateLabel ad={ad} /> },
    {
      title: "Impressions",
      dataIndex: "impressions",
      key: "impressions",
      align: "right",
      render: (v) => Number(v ?? 0).toLocaleString(),
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      align: "right",
      render: (v) => Number(v ?? 0).toLocaleString(),
    },
  ];

  return (
    <div>
      <PageHeader title="Ads" backTo="/admin/business-suite">
        <button
          type="button"
          onClick={() => navigate(`${ADS_BASE}/new`)}
          className="flex items-center gap-2 rounded-lg bg-[#1F5226] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0d5729]"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          New ad
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Ongoing" value={stats?.ongoing} loading={isLoadingStats} />
        <StatCard title="Completed" value={stats?.completed} loading={isLoadingStats} />
        <StatCard title="Cancelled" value={stats?.cancelled} loading={isLoadingStats} />
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-[#D6FADB] p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id || "all"}
              type="button"
              onClick={() => {
                setStatus(tab.id);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition ${
                status === tab.id ? "bg-white text-[#1F5226] shadow-sm" : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Input
          allowClear
          size="large"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or client"
          prefix={<HugeiconsIcon icon={Search01Icon} size={18} className="text-gray-400" />}
          className="!rounded-lg lg:!w-80"
        />
      </div>

      {error ? (
        <Alert type="error" showIcon message={errorMessage(error, "Failed to load ads")} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={ads}
            loading={isLoading || isFetching}
            pagination={false}
            scroll={{ x: 800 }}
            locale={{ emptyText: "No ads yet" }}
            onRow={(ad) => ({
              onClick: () => navigate(`${ADS_BASE}/${ad.id}`),
              className: "cursor-pointer",
            })}
          />
        </div>
      )}

      {lastPage > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={PER_PAGE}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default AdsList;
