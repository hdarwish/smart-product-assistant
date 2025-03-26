import axios from 'axios';
import { SearchResponse } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

export const searchProducts = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await axios.post(`${API_URL}/products/search`, { query });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}; 

export const getAllProducts = async (limit: number = 12, page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { limit, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
}; 