// api.js
import axios from 'axios';
import {
  requestLogger,
  responseLogger,
  errorLogger
} from 'axios-logger';

// Internal subscribers list
const subscribers = [];

export const subscribeToAxiosLogs = (callback) => {
  subscribers.push(callback);
};

// Emit to all subscribers
const emitLog = (type, message) => {
  subscribers.forEach((cb) => cb({ type, message }));
};

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:2100',
  withCredentials: true
});

// Wrapped loggers
api.interceptors.request.use((req) => {
  emitLog('request', `[Request] ${req.method?.toUpperCase()} ${req.url}`);
  return requestLogger(req);
}, (err) => {
  emitLog('error', `[Request Error] ${err.message}`);
  return errorLogger(err);
});

api.interceptors.response.use((res) => {
  emitLog('response', `[Response] ${res.status} ${res.config.url}`);
  return responseLogger(res);
}, (err) => {
  emitLog('error', `[Response Error] ${err?.response?.status || 'NO_STATUS'} ${err?.config?.url || 'UNKNOWN_URL'}`);
  return errorLogger(err);
});

export default api;
