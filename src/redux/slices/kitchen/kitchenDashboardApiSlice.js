import { get } from "react-hook-form";
import { api } from "../../api/rtkQuery";

export const kitchenDashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getKitchenDashBoardData: builder.query({
      query: () => "/kitchen/dashboard",
      providesTags: ["KitchenDashboard"],
    }),
    getDasOrderToPrepare: builder.query({
      query: ({ page = 1, status }) => {
        const statusQuery = status ? `&status=${status}` : "";
        return `/kitchen/orders/orders-to-prepare?page=${page}${statusQuery}`;
      },
      providesTags: ["KitchenDashboard"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/kitchen/orders/${orderId}/update-order-status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["KitchenDashboard"],
    }),
    getSpecialOrders: builder.query({
      query: ({ page = 1 }) => {
        return `/kitchen/orders/special-orders?page=${page}`;
      },
      providesTags: ["KitchenDashboard"],
    }),
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
