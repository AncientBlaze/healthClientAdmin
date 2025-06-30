import axios from "axios";

// Configuration constants (consider moving to environment variables)
const CONFIG = {
  LOG_KEY: "http-logs",
  BASE_URL:"http://localhost:2100",
  MAX_LOGS: 100,
  VALID_LOG_TYPES: ["request", "response", "error"],
  SENSITIVE_HEADERS: ["authorization", "x-api-key", "cookie", "set-cookie", "x-auth-token"],
  MAX_DATA_LENGTH: 1000,
};

// Generate a unique ID for logs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

// Sanitize sensitive headers
const sanitizeHeaders = (headers = {}) => {
  const sanitized = { ...headers };
  CONFIG.SENSITIVE_HEADERS.forEach((key) => {
    const normalizedKey = Object.keys(sanitized).find(
      (k) => k.toLowerCase() === key.toLowerCase()
    );
    if (normalizedKey) {
      sanitized[normalizedKey] = "[REDACTED]";
    }
  });
  return sanitized;
};

// Truncate large data payloads safely
const truncateData = (data, maxLength = CONFIG.MAX_DATA_LENGTH) => {
  if (typeof data === "string") {
    return data.length > maxLength ? `${data.slice(0, maxLength)}...[TRUNCATED]` : data;
  }
  if (typeof data === "object" && data !== null) {
    try {
      const stringified = JSON.stringify(data);
      if (stringified.length > maxLength) {
        return `${stringified.slice(0, maxLength)}...[TRUNCATED]`;
      }
      return data; // Return original object if within limits
    } catch {
      return "[UNPARSABLE DATA]";
    }
  }
  return data;
};

// Save log to localStorage
const saveLog = (type, data) => {
  if (!CONFIG.VALID_LOG_TYPES.includes(type)) {
    throw new Error(`Invalid log type: ${type}. Expected one of ${CONFIG.VALID_LOG_TYPES.join(", ")}`);
  }

  try {
    if (!window.localStorage) {
      console.warn("localStorage is not available");
      return;
    }

    const logEntry = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      ...data,
    };

    const logs = JSON.parse(localStorage.getItem(CONFIG.LOG_KEY) || "[]");
    const updatedLogs = [logEntry, ...logs].slice(0, CONFIG.MAX_LOGS);
    localStorage.setItem(CONFIG.LOG_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error("Failed to save log:", error.message);
    // Optionally, notify the caller or monitoring service
  }
};

// Validate URL for logging
const shouldLog = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === CONFIG.BASE_URL;
  } catch {
    return false;
  }
};

// Create Axios instance
const api = axios.create({
  baseURL: CONFIG.BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  (request) => {
    console.log("Request URL:", request.url);
    request.headers["Accept"] = "application/json";
    request.headers["Content-Type"] = "application/json";
    request.startTime = Date.now();

    if (shouldLog(request.url)) {
      saveLog("request", {
        method: (request.method || "UNKNOWN").toUpperCase(),
        url: request.url,
        headers: sanitizeHeaders(request.headers),
        data: truncateData(request.data),
      });
    }

    return request;
  },
  (error) => {
    if (error.config && shouldLog(error.config.url)) {
      saveLog("error", {
        message: error.message || "Unknown request error",
        url: error.config.url,
      });
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.startTime;

    if (shouldLog(response.config.url)) {
      saveLog("response", {
        status: response.status,
        statusText: response.statusText,
        data: truncateData(response.data),
        url: response.config.url,
        duration,
      });
    }

    return response;
  },
  (error) => {
    const errorMessage = error.response
      ? `Status ${error.response.status}: ${error.response.statusText}`
      : error.message || "Unknown error";

    if (error.config && shouldLog(error.config.url)) {
      saveLog("error", {
        message: errorMessage,
        status: error.response?.status,
        data: truncateData(error.response?.data),
        url: error.config.url,
      });
    }

    return Promise.reject(error);
  }
);

// Utility functions
export const getHttpLogs = () => {
  try {
    if (!window.localStorage) {
      console.warn("localStorage is not available");
      return [];
    }
    return JSON.parse(localStorage.getItem(CONFIG.LOG_KEY) || "[]");
  } catch (error) {
    console.error("Failed to retrieve logs:", error.message);
    return [];
  }
};

export const clearHttpLogs = () => {
  try {
    if (!window.localStorage) {
      console.warn("localStorage is not available");
      return;
    }
    localStorage.removeItem(CONFIG.LOG_KEY);
  } catch (error) {
    console.error("Failed to clear logs:", error.message);
  }
};

export const httpClient = {
  api,
  getHttpLogs,
  clearHttpLogs,
};

export default httpClient.api;