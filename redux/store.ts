import { configureStore } from "@reduxjs/toolkit";
import schedulerSlice from "./slices/schedulerSlice";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

export const store = configureStore({
  reducer: {
    scheduler: schedulerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }).concat(thunkMiddleware),
});

// export let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// define typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// making wrapper for store
export const wrapper = createWrapper(() => store);
