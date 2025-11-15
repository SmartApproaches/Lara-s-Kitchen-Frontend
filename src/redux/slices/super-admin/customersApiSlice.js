import { api } from "../../api/rtkQuery";

export const customersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ page, filter, search }) => ({
        url: "/admin/customers/all-customers",
        params: { page, filter, search },
      }),
      keepUnusedDataFor: 5,
    }),
    getCustomer: builder.query({
      query: (id) => `/admin/customers/customer-details/${id}`,
    }),
    getCustomerOrders: builder.query({
      query: ({ id, page }) => ({
        url: `/admin/customers/customer-orders/${id}`,
        params: { page },
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomerQuery, useGetCustomerOrdersQuery } =
  customersApiSlice;
