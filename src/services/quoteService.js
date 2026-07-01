import api from '../utils/axios';
import { ENDPOINTS } from './endpoints';

export const quoteService = {
  /**
   * Submit a new quote request
   * @param {Object} quoteData - { service_type, vcpu, ram, storage, monthly_price }
   * @returns {Promise}
   */
  createQuote: async (quoteData) => {
    try {
      const response = await api.post(ENDPOINTS.CREATE_QUOTE, quoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit quote request' };
    }
  },

  /**
   * Fetch quotes for the authenticated user
   * @returns {Promise}
   */
  getMyQuotes: async () => {
    try {
      const response = await api.get(ENDPOINTS.GET_MY_QUOTES);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your quotes' };
    }
  }
};
