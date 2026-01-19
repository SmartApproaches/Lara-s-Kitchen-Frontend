import { api } from "../../api/rtkQuery";

export const kitchenDashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // DASHBOARD STATS
    // =========================
    getKitchenDashBoardData: builder.query({
      query: ({ from, to, period } = {}) => {
        const params = new URLSearchParams();

        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (period) params.append("period", period);

        const queryString = params.toString();
        return `/kitchen/dashboard${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["KitchenDashboard"],
    }),

    // =========================
    // ORDERS TO PREPARE
    // =========================
    getDasOrderToPrepare: builder.query({
      query: ({ page = 1, status, from, to, period }) => {
        const params = new URLSearchParams();
        params.append("page", page);

        if (status) params.append("status", status);
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (period) params.append("period", period);

        return `/kitchen/orders/orders-to-prepare?${params.toString()}`;
      },
      providesTags: ["KitchenDashboard"],
    }),

    // =========================
    // UPDATE ORDER STATUS
    // =========================
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/kitchen/orders/${orderId}/update-order-status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["KitchenDashboard"],
    }),

    // =========================
    // SPECIAL ORDERS
    // =========================
    getSpecialOrders: builder.query({
      query: ({ page = 1, from, to, period }) => {
        const params = new URLSearchParams();
        params.append("page", page);

        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (period) params.append("period", period);

        return `/kitchen/orders/special-orders?${params.toString()}`;
      },
      providesTags: ["KitchenDashboard"],
    }),

    // =========================
    // REGISTER DEVICE
    // =========================
    registerDevice: builder.mutation({
      query: (deviceData) => ({
        url: "/kitchen/device/register",
        method: "POST",
        body: deviceData,
      }),
      invalidatesTags: ["KitchenDashboard"],
    }),
  }),
});

export const {
  useGetKitchenDashBoardDataQuery,
  useGetDasOrderToPrepareQuery,
  useUpdateOrderStatusMutation,
  useGetSpecialOrdersQuery,
  useRegisterDeviceMutation,
} = kitchenDashboardApiSlice;
