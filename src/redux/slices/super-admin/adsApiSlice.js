import { api } from "../../api/rtkQuery";

// Adverts for the mobile app's home screen carousel (super admin).
// Every change invalidates the "Ads" tag so lists, stats and details refetch.
export const adsApiSlice = api.enhanceEndpoints({ addTagTypes: ["Ads"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAdverts: builder.query({
      query: ({ page = 1, search, status } = {}) => ({
        url: "/admin/adverts",
        method: "GET",
        params: {
          page,
          ...(search && { search }),
          ...(status && { status }),
        },
      }),
      providesTags: ["Ads"],
    }),

    getAdvertStats: builder.query({
      query: () => "/admin/adverts/stats",
      providesTags: ["Ads"],
    }),

    getAdvert: builder.query({
      query: (id) => `/admin/adverts/${id}`,
      providesTags: ["Ads"],
    }),

    // body: FormData (picture in "image")
    createAdvert: builder.mutation({
      query: (body) => ({ url: "/admin/adverts", method: "POST", body }),
      invalidatesTags: ["Ads"],
    }),

    // body: FormData with only the changed fields
    updateAdvert: builder.mutation({
      query: ({ id, body }) => ({ url: `/admin/adverts/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Ads"],
    }),

    duplicateAdvert: builder.mutation({
      query: (id) => ({ url: `/admin/adverts/${id}/duplicate`, method: "POST" }),
      invalidatesTags: ["Ads"],
    }),

    stopAdvert: builder.mutation({
      query: (id) => ({ url: `/admin/adverts/${id}/stop`, method: "PATCH" }),
      invalidatesTags: ["Ads"],
    }),

    resumeAdvert: builder.mutation({
      query: (id) => ({ url: `/admin/adverts/${id}/resume`, method: "PATCH" }),
      invalidatesTags: ["Ads"],
    }),

    deleteAdvert: builder.mutation({
      query: (id) => ({ url: `/admin/adverts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Ads"],
    }),

    getAdvertMetrics: builder.query({
      query: (id) => `/admin/adverts/${id}/metrics`,
      providesTags: ["Ads"],
    }),

    // period: "7d" | "30d" | "12m"
    getAdvertChart: builder.query({
      query: ({ id, period = "7d" }) => ({
        url: `/admin/adverts/${id}/metrics/chart`,
        params: { period },
      }),
      providesTags: ["Ads"],
    }),
  }),
});

export const {
  useGetAdvertsQuery,
  useGetAdvertStatsQuery,
  useGetAdvertQuery,
  useCreateAdvertMutation,
  useUpdateAdvertMutation,
  useDuplicateAdvertMutation,
  useStopAdvertMutation,
  useResumeAdvertMutation,
  useDeleteAdvertMutation,
  useGetAdvertMetricsQuery,
  useGetAdvertChartQuery,
} = adsApiSlice;
