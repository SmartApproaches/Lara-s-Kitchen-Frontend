import { api } from "../../api/rtkQuery";

export const dashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => "/cashier/dashboard",
    }),
    getCashierDashboardMenu: builder.query({
      query: ({ page = 1 }) => `/cashier/dashboard/menus?page=${page}`,
    }),
  }),
});

export const { useGetDashboardDataQuery, useGetCashierDashboardMenuQuery } = dashboardApiSlice;
