import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize auth state from storage
  initialize: async () => {
    try {
      set({ isLoading: true });
      const token = await SecureStore.getItemAsync("token");
      const userStr = await SecureStore.getItemAsync("user");

      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Login action
  login: async (email, password, role = "CUSTOMER") => {
    try {
      set({ isLoading: true });
      console.log("Attempting to login with:", email, password);

      // API returns: { success, message, data: { user, token } }
      const response = await api.post("/users/login", {
        email,
        password,
        role,
      });
      console.log("Login API response:", response);

      // Check if login was successful
      if (!response.success) {
        set({ isLoading: false });
        return {
          success: false,
          message: response.message || "Login failed",
        };
      }

      // Destructure user and token from response.data
      const { user, token } = response.data;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return {
        success: true,
        message: response.message || "Login successful",
      };
    } catch (error) {
      console.error("Login action error:", error);
      set({ isLoading: false });
      // Error interceptor already formats this properly
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  },

  // Register action
  register: async (email, password, role = "CUSTOMER") => {
    try {
      set({ isLoading: true });

      // API returns: { success, message, data }
      const response = await api.post("/users", {
        email,
        password,
        role,
      });

      set({ isLoading: false });

      // Check if registration was successful
      if (!response.success) {
        return {
          success: false,
          message: response.message || "Registration failed",
        };
      }

      return {
        success: true,
        message: response.message || "Account created successfully",
      };
    } catch (error) {
      set({ isLoading: false });
      // Error interceptor already formats this properly
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));

export default useAuthStore;
