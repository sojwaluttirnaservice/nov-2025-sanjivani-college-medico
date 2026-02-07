import { HttpClient } from "@/utils/instance";
import toast from "@/utils/toast";
import * as SecureStore from "expo-secure-store";

const IP_ADDRESS = "10.126.255.131";

// API Configuration
const API_URL = `http://${IP_ADDRESS}:2555/api/v1`;

const api = new HttpClient({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Token Interceptor using SecureStore (Safer than AsyncStorage)
// Auth Token Interceptor using SecureStore (Safer than AsyncStorage)
api.useRequestInterceptor(async (url, config) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn("Failed to fetch token", e);
  }
  return { url, config };
});

// Logging Interceptor (Dev only?)
api.useResponseInterceptor((data, response) => {
  // Only log in dev mode if possible, but for now keeping it as requested
  // console.log('Response:', response.status, data);
  return data;
});

// Global Error Handler Interceptor
api.useResponseInterceptor((data, response) => {
  if (response && response.status) {
    const statusCode = response.status;
    // Handle unauthorized globally?
    if (statusCode === 401) {
      // e.g. Navigate to login?
      // toast.error('Session expired');
    } else if (statusCode >= 400 && statusCode < 500) {
      if (data && data.usrMsg) toast.warning(data.usrMsg);
    } else if (statusCode >= 500) {
      toast.error("Something went wrong on the server");
    }
  }
  return data;
});

export default api;
