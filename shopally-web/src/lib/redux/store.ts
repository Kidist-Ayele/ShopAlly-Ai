//src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "./api/chatApiSlice";
import { userApi } from "./api/userApiSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
