import { configureStore } from "@reduxjs/toolkit";
import schedulerSlice from "./slices/schedulerSlice";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import thunkMiddleware from "redux-thunk";

export const store = configureStore({
  reducer: {
    scheduler: schedulerSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// define typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
