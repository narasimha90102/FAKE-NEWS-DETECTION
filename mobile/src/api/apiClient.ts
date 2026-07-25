import axios from 'axios';

// Default to localhost:5000 (Use 10.0.2.2 for Android Emulator or LAN IP for physical device)
export const API_BASE_URL = 'http://10.0.2.2:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let userToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  userToken = token;
};

apiClient.interceptors.request.use(
  (config) => {
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session expired');
    }
    return Promise.reject(error);
  }
);
