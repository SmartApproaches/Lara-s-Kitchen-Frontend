import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "../rootReducer/rootReducer";
import { api } from "../api/rtkQuery";
import { adClientApi } from "../api/adClientApi";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["tokens", "login"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, adClientApi.middleware),
  devTools: true,
});
setupListeners(store.dispatch);

export let persistor = persistStore(store);

export default store;
