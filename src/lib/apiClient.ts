import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://0.0.0.0:3000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    });
