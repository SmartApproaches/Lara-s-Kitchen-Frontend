import { api } from "../../api/rtkQuery";

export const catalogueApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogue: builder.query({
      query: () => "/catalogue",
      providesTags: ["Catalogue"],
    }),
    getCatalogueItem: builder.query({
      query: (id) => `/catalogue/${id}`,
      providesTags: ["Catalogue"],
    }),
    editCatalogueItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/catalogue/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Catalogue"],
    }),
    addCatalogueItem: builder.mutation({
      query: (data) => ({
        url: "/catalogue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Catalogue"],
    }),
    deleteCatalogueItem: builder.mutation({
      query: (id) => ({
        url: `/catalogue/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Catalogue"],
    }),
  }),
});

export const {
  useGetCatalogueQuery,
  useGetCatalogueItemQuery,
  useEditCatalogueItemMutation,
  useAddCatalogueItemMutation,
  useDeleteCatalogueItemMutation,
} = catalogueApiSlice;
