import { api } from "../../api/rtkQuery";

export const specialOfferApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialOffers: builder.query({
      query: ({ page }) => ({
        url: "/admin/special-offers",
        method: "GET",
        params: { page: page ?? 1 },
      }),
      providesTags: ["SpecialOffer"],
      keepUnusedDataFor: 5,
    }),
    getSpecialOffersMenu: builder.query({
      query: ({ page, search }) => ({
        url: "/admin/special-offers/menu",
        method: "GET",
        params: { page: page ?? 1, search: search || "" },
      }),
      providesTags: ["SpecialOffer"],
      keepUnusedDataFor: 5,
    }),
    deleteOffer: builder.mutation({
      query: (offerId) => ({
        url: `/admin/special-offers/${offerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/special-offers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: "/admin/special-offers/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
  }),
});

export const {
  useGetSpecialOffersQuery,
  useGetSpecialOffersMenuQuery,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
  useCreateOfferMutation,
} = specialOfferApiSlice;
