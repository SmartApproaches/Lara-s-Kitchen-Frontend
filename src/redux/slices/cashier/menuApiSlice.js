import { api } from "../../api/rtkQuery";

export const menuApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCashierdMenu: builder.query({
      query: ({ page = 1, per_page = 10, search, category_id }) => {
        const params = new URLSearchParams({
          page,
          per_page,
        });

        if (search) params.append("search", search);
        if (category_id) params.append("category_id", category_id);

        return `/cashier/menus?${params.toString()}`;
      },

      providesTags: ["Menu"],
    }),

    updateMenuAvailability: builder.mutation({
      query: (body) => ({
        url: "/cashier/menus/update-menu-availability",
        method: "PUT",
        body: {
          menu_id: body.menu_id,
          is_available: body.is_available,
        },
      }),
    }),
    getCashierMenuCategories: builder.query({
      query: () => "/cashier/menus/categories",
    }),
    getCashierMenuSummary: builder.query({
      query: () => "/cashier/menus/summary",
    }),
  }),
});

export const {
  useGetCashierdMenuQuery,
  useUpdateMenuAvailabilityMutation,
  useGetCashierMenuCategoriesQuery,
  useGetCashierMenuSummaryQuery,
} = menuApiSlice;
