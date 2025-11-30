import { api } from "../../api/rtkQuery";

export const dashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ from, to, period, page = 1 } = {}) => ({
        url: "/cashier/dashboard",
        params: {
          from,
          to,
          period,
          page,
        },
      }),
    }),

    getCashierDashboardMenu: builder.query({
      query: ({ page = 1 }) => `/cashier/dashboard/menus?page=${page}`,
    }),
    registerDeviceCashier: builder.mutation({
      query: (deviceData) => ({
        url: "/cashier/device/register",
        method: "POST",
        body: deviceData,
      }),
      invalidatesTags: ["CashierDashboard"],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetCashierDashboardMenuQuery,
  useRegisterDeviceCashierMutation,
} = dashboardApiSlice;
