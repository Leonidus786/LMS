import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage for persistence
import authReducer from "@/features/authSlice";
import { authApi } from "@/features/api/authApi.js";
import { studentApi } from "@/features/api/studentApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";
import { zoomApi } from "@/features/api/zoomApi.js";
import { batchApi } from "@/features/api/batchApi.js";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only the auth slice (including token, user, isAuthenticated)
};

// Create a persisted reducer that combines all reducers
const persistedReducer = persistReducer(persistConfig, (state, action) => ({
  auth: authReducer(state?.auth, action),
  [authApi.reducerPath]: authApi.reducer(state?.[authApi.reducerPath], action),
  [studentApi.reducerPath]: studentApi.reducer(
    state?.[studentApi.reducerPath],
    action
  ),
  [courseApi.reducerPath]: courseApi.reducer(
    state?.[courseApi.reducerPath],
    action
  ),
  [purchaseApi.reducerPath]: purchaseApi.reducer(
    state?.[purchaseApi.reducerPath],
    action
  ),
  [courseProgressApi.reducerPath]: courseProgressApi.reducer(
    state?.[courseProgressApi.reducerPath],
    action
  ),
  [zoomApi.reducerPath]: zoomApi.reducer(state?.[zoomApi.reducerPath], action),
  [batchApi.reducerPath]: batchApi.reducer(
    state?.[batchApi.reducerPath],
    action
  ),
}));

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid serialization errors
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      studentApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware,
      zoomApi.middleware,
      batchApi.middleware
    ),
});

// Setup RTK Query listeners
setupListeners(store.dispatch);

// Create a persistor for redux-persist
export const persistor = persistStore(store);
export default store;
