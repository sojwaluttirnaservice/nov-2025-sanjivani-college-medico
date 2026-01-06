import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "MedoPlus",
  version: "1.0.0",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

const appReducer = appSlice.reducer;

export { appReducer };
