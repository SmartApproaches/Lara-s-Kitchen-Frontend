import { combineReducers } from "@reduxjs/toolkit";

import { api } from "../api/rtkQuery";
import loginSlice from "../features/auth/loginSlice";
import tokenSlice from "../features/auth/tokenSlice";
import categoriesSlice from "../slices/super-admin/categoriesSlice";

const rootReducer = combineReducers({
  login: loginSlice.reducer,
  tokens: tokenSlice.reducer,
  categories: categoriesSlice.reducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
