
import { api } from './api';
import { User } from '@/components/Layout';

// Extended User type for auth operations that include password
interface UserWithPassword extends User {
  password: string;
}

// Simple login service that works with JSON Server
export const login = async (email: string, password: string) => {
  // With JSON Server, we need to manually match credentials
  const { data: users } = await api.get<UserWithPassword[]>('/users', {
    params: { email }
  });

  const user = users.find(user => user.email === email && user.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // In a real app, we would get a token from the backend
  // For this demo, we'll simulate it with the user ID
  const token = `demo-token-${user.id}`;
  localStorage.setItem('financeNewsAuthToken', token);
  
  // Remove password before returning the user
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const logout = () => {
  localStorage.removeItem('financeNewsAuthToken');
};

// Get the current user based on the stored token
export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('financeNewsAuthToken');
  if (!token) return null;
  
  // Extract user ID from our simulated token
  const userId = token.replace('demo-token-', '');
  
  try {
    const { data } = await api.get<UserWithPassword>(`/users/${userId}`);
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  } catch (error) {
    localStorage.removeItem('financeNewsAuthToken');
    return null;
  }
};
