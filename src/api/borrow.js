import axios from 'axios';
import BaseURL from'./baseURL'
import { auth } from'../utils/auth'

export const borrowService = {
  
  BorrowBook: async (id) => {
    try {
      const response = await axios.post(`${BaseURL}/Borrowing/Borrow?bookId=${id}`,  null, 
        {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`
          }
    });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error Borrow book';
    }
  },
  fetchBorrowedBooks: async (userId) => {
    try {
      const response = await axios.get(`${BaseURL}/Borrowing/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${auth.getToken()}`
        }
      });
      return response;
    } catch (error) {
      console.error('Borrow service error:', error);
      throw error;
    }
  }


};