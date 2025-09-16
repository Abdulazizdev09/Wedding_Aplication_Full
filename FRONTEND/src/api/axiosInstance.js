import axios from "axios";
import { getToken } from "../utils/auth"; // Your function to get saved token (e.g., from localStorage)

const API_BASE_URL = "http://localhost:9000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header with Bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Implement this to get token from localStorage or context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
