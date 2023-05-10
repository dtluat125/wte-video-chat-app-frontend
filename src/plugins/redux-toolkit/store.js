import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/auth.reducer";
import { authApi } from "../../features/auth/service/auth.service";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(authApi.middleware),
  });
}
const store = makeStore();

export default store;
