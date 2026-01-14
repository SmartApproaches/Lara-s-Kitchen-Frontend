import { api } from "../../api/rtkQuery";

export const businessSuiteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralDeliveryFee: builder.query({
      query: () => "/admin/business-suite/general-delivery-fee",
      keepUnusedDataFor: 0,
      providesTags: ["DeliveryFee"],
    }),
    updateGeneralDeliveryFee: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/general-delivery-fee",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DeliveryFee"],
    }),

    postSpecialDeliveryFee: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/special-delivery-fee",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DeliveryFee"],
    }),
    getSpecialDeliveryFees: builder.query({
      query: () => "/admin/business-suite/special-delivery-fees",
      keepUnusedDataFor: 0,
      providesTags: ["DeliveryFee"],
    }),
    updateSpecialDeliveryFee: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/business-suite/delivery-fee/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DeliveryFee"],
    }),
    deleteSpecialDeliveryFee: builder.mutation({
      query: (id) => ({
        url: `/admin/business-suite/delivery-fee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeliveryFee"],
    }),

    getBusinessHours: builder.query({
      query: () => "/admin/business-suite/business-hours",
      keepUnusedDataFor: 0,
      providesTags: ["BusinessHours"],
    }),
    updateBusinessHours: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/update-business-hours",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["BusinessHours"],
    }),

    getGeofence: builder.query({
      query: () => "/admin/business-suite/geofence",
      keepUnusedDataFor: 0,
      providesTags: ["Geofence"],
    }),

    postGeofence: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/geofence",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Geofence"],
    }),
    getGeofenceByType: builder.query({
      query: (type) => `/admin/business-suite/geofence/${type}`,
      keepUnusedDataFor: 0,
      providesTags: ["Geofence"],
    }),
    updateGeofenceByType: builder.mutation({
      query: ({ type, data }) => ({
        url: `/admin/business-suite/geofence/${type}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Geofence"],
    }),
    deleteGeofenceByType: builder.mutation({
      query: (type) => ({
        url: `/admin/business-suite/geofence/${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Geofence"],
    }),
  }),
});

export const {
  useGetGeneralDeliveryFeeQuery,
  useGetBusinessHoursQuery,
  useUpdateGeneralDeliveryFeeMutation,
  usePostSpecialDeliveryFeeMutation,
  useGetSpecialDeliveryFeesQuery,
  useUpdateSpecialDeliveryFeeMutation,
  useDeleteSpecialDeliveryFeeMutation,
  useUpdateBusinessHoursMutation,
  useGetGeofenceQuery,
  usePostGeofenceMutation,
  useGetGeofenceByTypeQuery,
  useUpdateGeofenceByTypeMutation,
  useDeleteGeofenceByTypeMutation,
} = businessSuiteSlice;
