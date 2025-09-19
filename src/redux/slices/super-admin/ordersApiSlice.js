import { api } from "../../api/rtkQuery";

export const ordersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetOrderByIdQuery } = ordersApiSlice;
