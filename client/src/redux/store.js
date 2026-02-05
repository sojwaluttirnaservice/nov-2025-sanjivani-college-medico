import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./slices/appSlice";
import { authReducer } from "./slices/authSlice";
import { pharmacyReducer } from "./slices/pharmacySlice";

const store = configureStore({
  reducer: {
    // stores the basic info about the app
    app: appReducer,
    auth: authReducer,
    pharmacy: pharmacyReducer,
  },
});

export default store;
