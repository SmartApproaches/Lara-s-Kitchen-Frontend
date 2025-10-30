import axios from "axios";

import { customWarningToast } from "../../utils/toast";
import { clearTokens, setTokens } from "../features/auth/tokenSlice";
import { logoutUser } from "../features/auth/loginSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
});

export const createAuthInterceptor = (instance, store) => {
  instance.interceptors.request.use((config) => {
    const accessToken = store.getState().token.states.accessToken;
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const { refreshToken } = store.getState().tokens;
      const { isLoggedIn } = store.getState().login;
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        !originalRequest._retry
      ) {
        if (isLoggedIn) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(
              `${BASE_URL}/auth/refresh-token`,
              {
                refresh_token: refreshToken,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
            const access = refreshResponse.data?.data?.access_token;
            const refresh = refreshResponse.data?.data?.refresh_token;

            store.dispatch(clearTokens());

            store.dispatch(
              setTokens({
                accessToken: access,
                refreshToken: refresh,
              }),
            );

            originalRequest.headers.Authorization = `Bearer ${access}`;

            return instance(originalRequest);
          } catch (refreshError) {
            store.dispatch(clearTokens());
            customWarningToast("Session expired. Please log in again.");
            store.dispatch(logoutUser());

            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    },
  );
};
