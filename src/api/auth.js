import axios from 'axios';
import BaseURL from'./baseURL'
//const API_URL = process.env.REACT_APP_API_URL;

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${BaseURL}/user/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },
  register: async (userData) => {
    try {
      const response = await axios.post(`${BaseURL}/user/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Registration failed');
    }
  }
};