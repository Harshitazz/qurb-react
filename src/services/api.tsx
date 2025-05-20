import axios from 'axios';
import type { Product } from '../types';

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await axios.get<Product[]>(
    `${import.meta.env.VITE_API_BASE_URL}?category=${category}`
  );
  return response.data;
};