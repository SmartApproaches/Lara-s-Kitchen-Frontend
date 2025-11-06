import { api } from "../../api/rtkQuery";

export const kitchenDashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getKitchenDashBoardData: builder.query({
      query: () => "/kitchen/dashboard",
      providesTags: ["KitchenDashboard"],
    }),
    getDasOrderToPrepare: builder.query({
      query: ({ page = 1 }) => `/kitchen/dashboard/order-to-prepare?page=${page}`,
      providesTags: ["KitchenDashboard"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/kitchen/orders/${orderId}/update-order-status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["KitchenDashboard"],
    }),
  }),
});

export const {
  useGetKitchenDashBoardDataQuery,
  useGetDasOrderToPrepareQuery,
  useUpdateOrderStatusMutation,
} = kitchenDashboardApiSlice;
