
import { api } from './api';
import { User } from '@/components/Layout';

export const getUsers = async (params = {}) => {
  const { data } = await api.get('/users', { params });
  // Remove passwords before returning
  return data.map((user: User & { password: string }) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  // Remove password before returning
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const createUser = async (user: User & { password: string }) => {
  const { data } = await api.post('/users', user);
  // Remove password before returning
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const updateUser = async (user: Partial<User> & { id: string }) => {
  const { data } = await api.put(`/users/${user.id}`, user);
  // Remove password before returning
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
  return true;
};
