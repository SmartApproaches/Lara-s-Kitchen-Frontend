import { api } from "../../api/rtkQuery";
export const dineInOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDineInMenus: builder.query({
      query: (page = 1) => ({
        url: `/dine-in-orders/menus?page=${page}`,
        method: "GET",
      }),
      extraOptions: { skipAuth: true },
    }),

    placeDineInOrder: builder.mutation({
      query: (orderData) => ({
        url: "/dine-in-orders/place-order",
        method: "POST",
        body: orderData,
      }),
      extraOptions: { skipAuth: true },
    }),
  }),
});

export const { useGetDineInMenusQuery, usePlaceDineInOrderMutation } = dineInOrdersApi;
