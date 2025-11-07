import { api } from "../../api/rtkQuery";

export const catalogueApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogue: builder.query({
      query: (args) => ({
        url: "/admin/catalogue/all-menus",
        params: {
          page: args?.page ?? 1,
          search: args?.search ?? "",
        },
      }),
      providesTags: ["Catalogue"],
    }),
    getCatalogueItem: builder.query({
      query: (id) => `/admin/catalogue/menu-details/${id}`,
      providesTags: ["Catalogue"],
    }),
    editCatalogueItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/catalogue/update-menu/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Catalogue"],
    }),
    addCatalogueItem: builder.mutation({
      query: (data) => ({
        url: "/admin/catalogue/add-menu",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Catalogue"],
    }),
    deleteCatalogueItem: builder.mutation({
      query: (id) => ({
        url: `/admin/catalogue/delete-menu/${id}`,
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
