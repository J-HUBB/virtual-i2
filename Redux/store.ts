import { configureStore } from "@reduxjs/toolkit"
import { booksApi } from "./booksSlice"
import { setupListeners } from "@reduxjs/toolkit/query";
import { useRef } from "react";
import modalSlice from "./modalSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    modal: modalSlice,
    auth: authSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;