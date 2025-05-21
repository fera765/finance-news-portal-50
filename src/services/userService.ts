
import { api } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "editor" | "admin";
  status?: 'active' | 'banned';
};

export interface ExtendedUser extends User {
  password?: string;
  avatar?: string;
};

export const getUsers = async (params = {}) => {
  const { data } = await api.get('/users', { params });
  // Remove passwords before returning
  return data.map((user: ExtendedUser) => {
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

export const createUser = async (user: ExtendedUser) => {
  // Set default status as active for new users
  const newUser = { ...user, status: user.status || 'active' };
  
  const { data } = await api.post('/users', newUser);
  // Remove password before returning
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const updateUser = async (user: Partial<ExtendedUser> & { id: string }) => {
  const { data } = await api.put(`/users/${user.id}`, user);
  // Remove password before returning
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
  return true;
};

export const banUser = async (id: string) => {
  const { data } = await api.patch(`/users/${id}`, { status: 'banned' });
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

export const unbanUser = async (id: string) => {
  const { data } = await api.patch(`/users/${id}`, { status: 'active' });
  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};
