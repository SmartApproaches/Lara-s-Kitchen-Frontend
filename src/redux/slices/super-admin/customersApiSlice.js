import { api } from "../../api/rtkQuery";

export const customersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "/customers",
      keepUnusedDataFor: 5,
    }),
    getCustomer: builder.query({
      query: (id) => `/customers/${id}`,
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomerQuery } = customersApiSlice;
