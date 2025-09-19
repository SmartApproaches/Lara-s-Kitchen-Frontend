import { api } from "../../api/rtkQuery";

export const specialOfferApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialOffers: builder.query({
      query: () => "/special-offers",
      providesTags: ["SpecialOffer"],
    }),
    deleteOffer: builder.mutation({
      query: (offerId) => ({
        url: `/special-offers/${offerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/special-offers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: "/special-offers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpecialOffer"],
    }),
  }),
});

export const {
  useGetSpecialOffersQuery,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
  useCreateOfferMutation,
} = specialOfferApiSlice;
