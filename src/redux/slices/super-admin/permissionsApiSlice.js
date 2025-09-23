import { api } from "../../api/rtkQuery";

export const permissionsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => "/permissions",
      providesTags: ["Permissions"],
    }),
    getPermission: builder.query({
      query: (id) => `/permissions/${id}`,
      providesTags: ["Permissions"],
    }),
    createPermission: builder.mutation({
      query: (data) => ({
        url: "/permissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permissions"],
    }),
    updatePermission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/permissions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Permissions"],
    }),
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permissions"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApiSlice;
