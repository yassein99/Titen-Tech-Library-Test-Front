import axios from 'axios';
import BaseURL from'./baseURL'
//const API_URL = process.env.REACT_APP_API_URL;
import { auth } from'../utils/auth'

export const userService = {
    fetchUsers: async () => {
    try {
      const response = await axios.get(`${BaseURL}/user`,
        null, 
        {
        headers: {
            'Authorization': `Bearer ${auth.getToken()}`
        }
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || 'error get users';
    }
  },



};