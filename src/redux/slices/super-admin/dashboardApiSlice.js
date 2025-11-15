import { api } from "../../api/rtkQuery";

export const dashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: ({ to, from, period } = {}) => ({
        url: "/admin/dashboard/summary",
        method: "GET",
        params: { to, from, period },
      }),
      keepUnusedDataFor: 1,
      providesTags: ["DashboardSummary"],
    }),
    getDashboardTotalRevenue: builder.query({
      query: ({ to, from, period } = {}) => ({
        url: "/admin/dashboard/total_revenue",
        method: "GET",
        params: { to, from, period },
      }),
      keepUnusedDataFor: 1,
      providesTags: ["DashboardTotalRevenue"],
    }),
    getDashboardRecentOrders: builder.query({
      query: () => ({
        url: "/admin/dashboard/recent_orders",
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: ["DashboardRecentOrders"],
    }),
  }),
});

export const {
  useLazyGetDashboardSummaryQuery,
  useLazyGetDashboardTotalRevenueQuery,
  useGetDashboardRecentOrdersQuery,
} = dashboardApiSlice;
