import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    clearTokens: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setTokens, clearTokens } = tokenSlice.actions;

export default tokenSlice;
