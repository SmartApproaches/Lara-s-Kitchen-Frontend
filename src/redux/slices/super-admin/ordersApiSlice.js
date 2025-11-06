import { api } from "../../api/rtkQuery";

export const ordersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ to, from, period, page }) => ({
        url: "/admin/orders/all-orders",
        method: "GET",
        params: { to, from, period, page },
      }),
      keepUnusedDataFor: 1,
      providesTags: ["Orders"],
    }),
    getOrdersSummary: builder.query({
      query: () => ({
        url: "/admin/orders/summary",
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: ["Orders"],
    }),
  }),
});

export const { useLazyGetAllOrdersQuery, useGetOrdersSummaryQuery } =
  ordersApiSlice;
