import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PROXY = import.meta.env.VITE_API_BASE_URL;
const baseQuery = fetchBaseQuery({
  baseUrl: PROXY,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().token.states.accessToken;
    if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result?.error?.status === 401 ||
    result?.error?.status === 403 ||
    result?.error?.status === 409
  ) {
    //logout user
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Products", "Orders"],
  endpoints: (builder) => ({}),
  refetchOnMountOrArgChange: 1,
});
