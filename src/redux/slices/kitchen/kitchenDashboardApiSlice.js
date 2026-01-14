// import { get } from "react-hook-form";
// import { api } from "../../api/rtkQuery";

// export const kitchenDashboardApiSlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getKitchenDashBoardData: builder.query({
//       query: () => "/kitchen/dashboard",
//       providesTags: ["KitchenDashboard"],
//     }),
//     getDasOrderToPrepare: builder.query({
//       query: ({ page = 1, status }) => {
//         const statusQuery = status ? `&status=${status}` : "";
//         return `/kitchen/orders/orders-to-prepare?page=${page}${statusQuery}`;
//       },
//       providesTags: ["KitchenDashboard"],
//     }),

//     updateOrderStatus: builder.mutation({
//       query: ({ orderId, status }) => ({
//         url: `/kitchen/orders/${orderId}/update-order-status`,
//         method: "PATCH",
//         body: { status },
//       }),
//       invalidatesTags: ["KitchenDashboard"],
//     }),
//     getSpecialOrders: builder.query({
//       query: ({ page = 1 }) => {
//         return `/kitchen/orders/special-orders?page=${page}`;
//       },
//       providesTags: ["KitchenDashboard"],
//     }),
//     registerDevice: builder.mutation({
//       query: (deviceData) => ({
//         url: "/kitchen/device/register",
//         method: "POST",
//         body: deviceData,
//       }),
//       invalidatesTags: ["KitchenDashboard"],
//     }),
//   }),
// });

// export const {
//   useGetKitchenDashBoardDataQuery,
//   useGetDasOrderToPrepareQuery,
//   useUpdateOrderStatusMutation,
//   useGetSpecialOrdersQuery,
//   useRegisterDeviceMutation,
// } = kitchenDashboardApiSlice;

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
