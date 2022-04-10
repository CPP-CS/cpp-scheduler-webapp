import { configureStore } from "@reduxjs/toolkit";
import schedulerSlice from "./slices/schedulerSlice";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    scheduler: schedulerSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(thunkMiddleware),
});

persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// define typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
