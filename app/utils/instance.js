import { toast } from "./toast";

// Default timeout for requests (15 seconds)
const DEFAULT_TIMEOUT = 15000;

/**
 * @typedef {Object} ApiResponse
 * @property {any} data
 * @property {boolean} success
 * @property {string} [usrMsg]
 * @property {string} [errMsg]
 * @property {number} [statusCode]
 */

/**
 * Custom error class for HTTP errors.
 */
export class HttpError extends Error {
  constructor(message, statusCode = 0, usrMsg = "", errMsg = "", data = null) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.usrMsg = usrMsg;
    this.errMsg = errMsg;
    this.data = data;
  }
}

/**
 * A lightweight HTTP client similar to Axios, tailored for React Native (Expo).
 */
export class HttpClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = config.headers || {
      "Content-Type": "application/json",
    };
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  useRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async request(method, url, body = null, headers = {}) {
    let fullUrl = this.baseURL + url;
    let config = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
    };

    if (body) {
      if (body instanceof FormData) {
        config.body = body;
        // Let the browser/engine set the Content-Type with the boundary
        delete config.headers["Content-Type"];
      } else {
        config.body = JSON.stringify(body);
      }
    }

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      const modified = await interceptor(fullUrl, config);
      if (modified) {
        fullUrl = modified.url || fullUrl;
        config = modified.config || config;
      }
    }

    // Timeout Handling using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      // Note: fetch works with HTTP (cleartext) in React Native,
      // provided the platform definition (AndroidManifest.xml / Info.plist) allows it.
      // By default, Android blocks cleartext HTTP. You need `android:usesCleartextTraffic="true"` in AndroidManifest.
      // iOS requires NSAppTransportSecurity configuration.
      const response = await fetch(fullUrl, config);
      clearTimeout(timeoutId);

      let resData = null;

      try {
        // Try parsing JSON, fallback to text/null if empty or HTML
        const textData = await response.text();
        try {
          resData = textData ? JSON.parse(textData) : null;
        } catch {
          // If parsing failed but we have text (e.g. HTML error), unexpected format
          resData = { errMsg: textData };
        }
      } catch (err) {
        // JSON parsing failed, likely HTML or empty body.
        // We already assigned resData if parsing failed but text existed.
        // If text() failed, resData is null.
        if (!resData && response.status !== 204) {
          console.warn("[HttpClient] Response body parsing failed", err);
        }
      }

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        resData = (await interceptor(resData, response)) || resData;
      }

      const statusCode = (resData && resData.statusCode) || response.status;

      if (!response.ok || statusCode >= 400) {
        throw new HttpError(
          (resData && resData.usrMsg) || "Something went wrong",
          statusCode,
          resData && resData.usrMsg,
          resData && resData.errMsg,
          (resData && resData.data) || null,
        );
      }

      return {
        success: true,
        data: resData ? resData.data : null,
        errMsg: resData ? resData.errMsg : null,
        statusCode: statusCode,
        usrMsg: resData ? resData.usrMsg : null,
      };
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === "AbortError") {
        toast.warning("Request timed out. Please check your connection.");
        throw new HttpError(
          "Request timed out",
          408,
          "Request timed out",
          "Timeout",
        );
      }

      if (err instanceof HttpError) {
        throw err;
      }

      // Network error mostly (or fetch failure)
      console.error("[HttpClient] Request Failed:", err.message);
      toast.warning("Please check your internet connection");
      throw new HttpError(
        "Please check your internet connection",
        0,
        "Please check your internet connection",
        err.message || "Unknown error",
      );
    }
  }

  get(url, headers = {}) {
    return this.request("GET", url, null, headers);
  }
  post(url, body = {}, headers = {}) {
    return this.request("POST", url, body, headers);
  }
  put(url, body = {}, headers = {}) {
    return this.request("PUT", url, body, headers);
  }
  patch(url, body = {}, headers = {}) {
    return this.request("PATCH", url, body, headers);
  }
  delete(url, headers = {}) {
    return this.request("DELETE", url, null, headers);
  }
}
