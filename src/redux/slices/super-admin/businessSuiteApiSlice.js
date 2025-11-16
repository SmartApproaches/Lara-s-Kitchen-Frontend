import { api } from "../../api/rtkQuery";

export const businessSuiteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryFee: builder.query({
      query: () => "/admin/business-suite/delivery-fee",
      keepUnusedDataFor: 0,
    }),

    getBusinessHours: builder.query({
      query: () => "/admin/business-suite/business-hours",
      keepUnusedDataFor: 0,
    }),

    updateDeliveryFee: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/update-delivery-fee",
        method: "PUT",
        body,
      }),
    }),

    updateBusinessHours: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/update-business-hours",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetDeliveryFeeQuery,
  useGetBusinessHoursQuery,
  useUpdateDeliveryFeeMutation,
  useUpdateBusinessHoursMutation,
} = businessSuiteSlice;
