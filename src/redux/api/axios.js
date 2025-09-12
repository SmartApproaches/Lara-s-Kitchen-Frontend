import axios from "axios";

import { customWarningToast } from "../../utils/toast";

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
      const { status } = error.response;
      if (status === 401 || status === 403 || status === 409) {
        customWarningToast("Session expired. Please log in again.");

        //log out user
      }
      return Promise.reject(error);
    }
  );
};
