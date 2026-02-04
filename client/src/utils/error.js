import axios from "axios";
import message from "./message";

/**
 * Extract error message from various error types
 * @param {Error | any} error - The error object (preferably axios error)
 * @returns {string} - Extracted error message
 */
export const extractError = (error) => {
  // Check if it's an Axios error
  if (axios.isAxiosError(error)) {
    // Try to get message from response data
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Try to get error from response data
    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    // Handle different status codes
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return "Bad request. Please check your input.";
        case 401:
          return "Unauthorized. Please login again.";
        case 403:
          return "Access denied.";
        case 404:
          return "Resource not found.";
        case 409:
          return "Conflict. Resource already exists.";
        case 500:
          return "Internal server error. Please try again later.";
        default:
          return `Error: ${error.response.status}`;
      }
    }

    // Network error
    if (error.request) {
      return "Network error. Please check your internet connection.";
    }
  }

  // If error has a message property
  if (error?.message) {
    return error.message;
  }

  // If error is a string
  if (typeof error === "string") {
    return error;
  }

  // Default fallback
  return "An unexpected error occurred.";
};

/**
 * Show error toast notification
 * @param {Error | any} error - The error object
 * @param {string} [fallbackMessage] - Optional fallback message if extraction fails
 */
export const showError = (error, fallbackMessage) => {
  const errorMessage = extractError(error);
  message.error(fallbackMessage || errorMessage);
};

/**
 * Show success toast notification
 * @param {string} msg - Success message to display
 */
export const showSuccess = (msg) => {
  message.success(msg);
};

/**
 * Log error to console in development
 * @param {string} context - Context where error occurred
 * @param {Error | any} error - The error object
 */
export const logError = (context, error) => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
};
