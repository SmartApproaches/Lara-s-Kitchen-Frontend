import { api } from "../../api/rtkQuery";

export const menuApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCashierDashboardMenu: builder.query({
      query: () => "/cashier/dashboard/menu",
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
  }),
});

export const { useGetCashierDashboardMenuQuery, useUpdateMenuAvailabilityMutation } = menuApiSlice;
