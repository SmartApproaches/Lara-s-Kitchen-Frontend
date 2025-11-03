import { api } from "../../api/rtkQuery";

export const permissionsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: (args) => ({
        url: "/admin/permission/employees",
        params: { page: args?.page ?? 1 },
      }),
      providesTags: ["Permissions"],
    }),
    getPermission: builder.query({
      query: (id) => `/admin/permission/employee-details/${id}`,
      providesTags: ["Permissions"],
    }),
    createPermission: builder.mutation({
      query: ({ ...data }) => ({
        url: "/admin/permission/add-employee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permissions"],
    }),
    updatePermission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/permission/update-employee/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Permissions"],
    }),
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/admin/permission/delete-employee/${id}`,
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
