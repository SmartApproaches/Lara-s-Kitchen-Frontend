import { api } from "../../api/rtkQuery";

export const ordersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCashierOrders: builder.query({
      query: ({ page = 1 }) => `/cashier/orders?page=${page}`,
    }),
    getOrderById: builder.query({
      query: (id) => `/cashier/orders/${id}`,
    }),
    getCashierOrderSummary: builder.query({
      query: () => "/cashier/orders/summary",
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/cashier/orders",
        method: "POST",
        body: orderData,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/cashier/orders/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/cashier/orders/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCashierOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetCashierOrderSummaryQuery,
} = ordersApiSlice;
