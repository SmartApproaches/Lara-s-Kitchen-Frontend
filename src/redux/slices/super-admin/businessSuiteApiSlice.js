import { api } from "../../api/rtkQuery";

export const businessSuiteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryFee: builder.query({
      query: () => "/admin/business-suite/delivery-fee",
      keepUnusedDataFor: 0,
      providesTags: ["DeliveryFee"],
    }),

    getBusinessHours: builder.query({
      query: () => "/admin/business-suite/business-hours",
      keepUnusedDataFor: 0,
      providesTags: ["BusinessHours"],
    }),

    updateDeliveryFee: builder.mutation({
      query: (body) => ({
        url: "/admin/business-suite/update-delivery-fee",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DeliveryFee"],
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
  useGetDeliveryFeeQuery,
  useGetBusinessHoursQuery,
  useUpdateDeliveryFeeMutation,
  useUpdateBusinessHoursMutation,
  useGetGeofenceQuery,
  usePostGeofenceMutation,
  useGetGeofenceByTypeQuery,
  useUpdateGeofenceByTypeMutation,
  useDeleteGeofenceByTypeMutation,
} = businessSuiteSlice;
