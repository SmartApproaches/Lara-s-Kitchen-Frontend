import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

import { setTokens, clearTokens } from "./tokenSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  loading: false,
  success: false,
  userLogin: null,
  isLoggedIn: !false,
  error: null,
};

export const loginAuth = createAsyncThunk(
  "login/loginAuth",
  async (data, { dispatch }) => {
    return axios
      .post(`${BASE_URL}/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const access_token = response.data?.access_token;
        dispatch(setTokens({ accessToken: access_token }));
        return response.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  }
);

export const logoutVendor = createAsyncThunk(
  "login/logout",
  async (_, { dispatch }) => {
    dispatch(clearTokens());
    dispatch(logout());
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.userLogin = null;
      toast.success("Logged out");
    },
    resetError: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginAuth.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload?.access_token) {
        state.success = true;
        state.userLogin = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        toast.success("Login successful");
      } else {
        state.success = false;
        state.userLogin = null;
        state.isLoggedIn = false;
        state.error = toast.error("You have errors in your form.");
        const errorMessage = action.payload?.message?.error;
        toast.error(
          typeof errorMessage === "string" && errorMessage
            ? errorMessage
            : "Failed to login, please try again."
        );
      }
    });
    builder.addCase(loginAuth.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.userLogin = null;
      state.isLoggedIn = false;
      const errorMessage = action.payload?.message?.error;
      toast.error(
        typeof errorMessage === "string" && errorMessage
          ? errorMessage
          : "Failed to login, please try again."
      );
      state.error = "sysError";
    });
  },
});

export const { logout, resetError } = loginSlice.actions;

export default loginSlice;
