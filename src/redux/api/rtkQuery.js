import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { clearTokens, setTokens } from "../features/auth/tokenSlice";
import { logoutUser } from "../features/auth/loginSlice";
import { customWarningToast } from "../../utils/toast";

const PROXY = import.meta.env.VITE_API_BASE_URL;
const baseQuery = fetchBaseQuery({
  baseUrl: PROXY,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().tokens?.accessToken;
    if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const { isLoggedIn } = api.getState().login;
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401 || (result?.error?.status === 403 && isLoggedIn)) {
    const refreshResult = await baseQuery(
      {
        url: `/auth/refresh-token`,
        method: "POST",
        body: { refresh_token: api.getState().login?.userLogin?.refresh_token },
      },
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      api.dispatch(
        setTokens({
          accessToken: refreshResult.data?.data?.access_token,
          refreshToken: refreshResult.data?.data?.refresh_token,
        }),
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      customWarningToast("Your session has expired. Please log in again.");
      api.dispatch(clearTokens());
      api.dispatch(logoutUser());
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Products", "Orders"],
  endpoints: (builder) => ({}),
  refetchOnMountOrArgChange: 1,
});
