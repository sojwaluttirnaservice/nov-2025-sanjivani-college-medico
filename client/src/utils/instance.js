import axios from "axios";
import clientConfig from "../config/clientConfig";
import { showError } from "./error";

const instance = axios.create({
  baseURL: clientConfig.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Attach token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Handle successful responses
instance.interceptors.response.use(
  (response) => {
    // Return the data object from API response
    return response.data;
  },
  (error) => {
    // Show error toast using utility
    showError(error);

    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export { instance };
