import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// API Configuration
// Replace with your computer's IP address if testing on a physical device
// For Android Emulator, use 'http://10.0.2.2:2555'
// For iOS Simulator, use 'http://localhost:2555'
// const API_URL = "http://10.141.179.220:2555/api/v1";

const IP_ADDRESS = "10.126.255.131";
export const API_URL = `http://${IP_ADDRESS}:2555/api/v1`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request Interceptor - Inject JWT Token
api.interceptors.request.use(
  async (config) => {
    try {
      console.log(
        `🚀 Sending Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Handle API Response Format & Errors
api.interceptors.response.use(
  (response) => {
    /**
     * Backend Response Format:
     * {
     *   success: true,
     *   statusCode: 200,
     *   message: "Success message",
     *   data: { ... },
     *   error: null
     * }
     */
    console.log("API Response Config:", response.config.url);
    console.log("API Response Data:", JSON.stringify(response.data, null, 2));
    return response.data;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: "Network error. Please check your connection.",
        statusCode: 0,
        data: null,
        error: error.message,
      });
    }

    // Extract backend error response
    const errorResponse = error.response.data;

    /**
     * Backend Error Format:
     * {
     *   success: false,
     *   statusCode: 400/401/404/500,
     *   message: "Error message from backend",
     *   data: null,
     *   error: "Error details"
     * }
     */

    // Handle 401 Unauthorized - Auto logout
    if (error.response.status === 401) {
      try {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        // Redirect to login (only if not already on auth screen)
        if (router.canGoBack()) {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        console.error("Error during auto-logout:", e);
      }
    }

    // Return structured error with backend message
    return Promise.reject({
      success: false,
      message: errorResponse?.message || "An error occurred",
      statusCode: error.response.status,
      data: errorResponse?.data || null,
      error: errorResponse?.error || error.message,
    });
  },
);

export default api;
