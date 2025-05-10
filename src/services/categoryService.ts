
import { api } from './api';

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

export const getCategories = async (params = {}) => {
  const { data } = await api.get('/categories', { params });
  return data;
};

export const getCategoryById = async (id: string) => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

export const createCategory = async (category: Category) => {
  const { data } = await api.post('/categories', category);
  return data;
};

export const updateCategory = async (category: Category) => {
  const { data } = await api.put(`/categories/${category.id}`, category);
  return data;
};

export const deleteCategory = async (id: string) => {
  await api.delete(`/categories/${id}`);
  return true;
};
