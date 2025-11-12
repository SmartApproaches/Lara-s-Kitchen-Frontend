import { api } from "../../api/rtkQuery";

export const transactionApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionSummary: builder.query({
      query: () => "/cashier/transactions/summary",
    }),
    getCashierTransactions: builder.query({
      query: ({ page = 1 }) => `/cashier/transactions?page=${page}`,
    }),
  }),
});

export const { useGetTransactionSummaryQuery, useGetCashierTransactionsQuery } =
  transactionApiSlice;
