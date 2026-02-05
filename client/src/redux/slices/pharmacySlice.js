import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null, // Pharmacy profile data
  isLoading: false,
  error: null,
};

const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState,
  reducers: {
    setPharmacyProfile: (state, action) => {
      state.profile = action.payload;
      state.error = null;
    },
    clearPharmacyProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setPharmacyLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPharmacyError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setPharmacyProfile,
  clearPharmacyProfile,
  setPharmacyLoading,
  setPharmacyError,
} = pharmacySlice.actions;

// Selectors
export const selectPharmacyProfile = (state) => state.pharmacy.profile;
export const selectPharmacyLoading = (state) => state.pharmacy.isLoading;
export const selectPharmacyError = (state) => state.pharmacy.error;

export const pharmacyReducer = pharmacySlice.reducer;
