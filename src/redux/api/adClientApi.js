// API for the advertisers' (ad clients') page at /advertisers.
// Kept apart from the shared staff `api`: that one refreshes the staff token on a 401 and
// logs staff out, which is wrong for a client. The client's token lives in its own storage key.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const KEY = "lk-ad-client";

export const clientSession = {
  // { access_token, expires_at, client_email }, or null when missing or expired.
  get() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return saved && new Date(saved.expires_at) > new Date() ? saved : null;
    } catch {
      return null;
    }
  },
  set(session) {
    try {
      localStorage.setItem(KEY, JSON.stringify(session));
    } catch {
      // Storage blocked (e.g. private mode): the client will need to sign in again.
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  },
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const session = clientSession.get();
    if (session) headers.set("authorization", `Bearer ${session.access_token}`);
    return headers;
  },
});

const data = (answer) => answer?.data;

export const adClientApi = createApi({
  reducerPath: "adClientApi",
  baseQuery: async (args, api, extra) => {
    const result = await rawBaseQuery(args, api, extra);
    const signingIn = String(args?.url ?? args).startsWith("/advert-client/sign-in");
    // Token missing, expired or not a client token: back to the sign-in step.
    if (result.error?.status === 401 && !signingIn) {
      clientSession.clear();
      window.location.assign("/advertisers");
    }
    return result;
  },
  tagTypes: ["MyAds"],
  endpoints: (build) => ({
    sendCode: build.mutation({
      query: (email) => ({ url: "/advert-client/sign-in/code", method: "POST", body: { email } }),
    }),
    signIn: build.mutation({
      query: (body) => ({ url: "/advert-client/sign-in", method: "POST", body }),
      transformResponse: data,
    }),
    myAds: build.query({
      query: () => "/advert-client/adverts",
      transformResponse: data,
      providesTags: ["MyAds"],
    }),
    myAd: build.query({
      query: (id) => `/advert-client/adverts/${id}`,
      transformResponse: data,
      providesTags: ["MyAds"],
    }),
    myAdMetrics: build.query({
      query: (id) => `/advert-client/adverts/${id}/metrics`,
      transformResponse: data,
      providesTags: ["MyAds"],
    }),
    myAdChart: build.query({
      query: ({ id, period }) => ({
        url: `/advert-client/adverts/${id}/metrics/chart`,
        params: { period },
      }),
      transformResponse: data,
      providesTags: ["MyAds"],
    }),
  }),
});

export const {
  useSendCodeMutation,
  useSignInMutation,
  useMyAdsQuery,
  useMyAdQuery,
  useMyAdMetricsQuery,
  useMyAdChartQuery,
} = adClientApi;
