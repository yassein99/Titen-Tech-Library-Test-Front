import axios from 'axios';
import BaseURL from'./baseURL'
//const API_URL = process.env.REACT_APP_API_URL;
import { auth } from'../utils/auth'

export const bookService = {
    fetchBooks: async () => {
    try {
      const response = await axios.get(`${BaseURL}/book`);
      return response;
    } catch (error) {
      throw error.response?.data?.message || 'error get books';
    }
  },

  searchBooks: async (searchCriteria) => {
    try {
      const response = await axios.get(`${BaseURL}/book/search?search=${searchCriteria}`);
      return response;
    } catch (error) {
      throw error.response?.data?.message || 'error search books';
    }
  },

  isAvailable: async (id) => {
    try {
      const response = await axios.get(`${BaseURL}/book/isavailable`, {
        params: { id } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error checking book availability';
    }
  },

  getBookDetail: async (id) => {
    try {
      const response = await axios.get(`${BaseURL}/book/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error get book details';
    }
  },
  returnBook: async (borrowingId) => {
    try {
      const response = await axios.put(
        `${BaseURL}/Borrowing/Return/${borrowingId}`,
        null, 
        {
          headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                  }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};