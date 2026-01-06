import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./slices/appSlice";

const store = configureStore({
  reducer: {
    // stores the basic info about the app
    app: appReducer,
  },
});

export default store;
