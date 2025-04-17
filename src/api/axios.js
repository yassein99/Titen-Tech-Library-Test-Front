import axios from 'axios';
import { auth } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


axiosInstance.interceptors.request.use((config) => {
  if (auth.isTokenValid()) {
    config.headers.Authorization = `Bearer ${auth.getToken()}`;
  }else {
    auth.removeToken();
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      auth.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;