import { api } from "../../api/rtkQuery";

export const kitchenMenuApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getKitchenMenu: builder.query({
      query: ({ page = 1, per_page = 10, search, category_id }) => {
        const params = new URLSearchParams({
          page,
          per_page,
        });

        if (search) params.append("search", search);
        if (category_id) params.append("category_id", category_id);

        return `/kitchen/menus?${params.toString()}`;
      },

      providesTags: ["Menu"],
    }),

    updateMenuAvailability: builder.mutation({
      query: (body) => ({
        url: "/kitchen/menus/update-menu-availability",
        method: "PUT",
        body: {
          menu_id: body.menu_id,
          is_available: body.is_available,
        },
      }),
    }),
    getKitchenMenuCategories: builder.query({
      query: () => "/kitchen/menus/categories",
    }),
    getKitchenMenuSummary: builder.query({
      query: () => "/kitchen/menus/summary",
    }),
  }),
});

export const {
  useGetKitchenMenuQuery,
  useUpdateMenuAvailabilityMutation,
  useGetKitchenMenuCategoriesQuery,
  useGetKitchenMenuSummaryQuery,
} = kitchenMenuApiSlice;
