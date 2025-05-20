
import { api } from './api';
import { User } from '@/components/Layout';

// Mock users for offline/demo mode
const MOCK_USERS = [
  {
    id: "mock-user-1",
    name: "Usuário Demonstração",
    email: "demo@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?u=demo",
    role: "user" as "user" | "admin" | "editor"
  },
  {
    id: "mock-admin-1",
    name: "Admin Demonstração",
    email: "admin@example.com",
    password: "admin123",
    avatar: "https://i.pravatar.cc/150?u=admin",
    role: "admin" as "user" | "admin" | "editor"
  }
];

// Extended User type for auth operations that include password
interface UserWithPassword extends User {
  password: string;
}

// Simple login service that works with JSON Server
export const login = async (email: string, password: string): Promise<User> => {
  try {
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
    return userWithoutPassword as User;
  } catch (error) {
    console.error("Login error:", error);
    
    // If server is unreachable, try mock users for demo mode
    if (error.message === 'Network Error') {
      const mockUser = MOCK_USERS.find(user => 
        user.email === email && user.password === password
      );
      
      if (mockUser) {
        console.log("Using mock user for demo mode");
        const token = `mock-token-${mockUser.id}`;
        localStorage.setItem('financeNewsAuthToken', token);
        
        // Remove password before returning
        const { password: _, ...userWithoutPassword } = mockUser;
        return userWithoutPassword;
      }
    }
    
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('financeNewsAuthToken');
};

// Get the current user based on the stored token
export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('financeNewsAuthToken');
  if (!token) return null;
  
  // Check if it's a mock token
  if (token.startsWith('mock-token-')) {
    const mockUserId = token.replace('mock-token-', '');
    const mockUser = MOCK_USERS.find(user => user.id === mockUserId);
    
    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser;
      return userWithoutPassword;
    }
    
    return null;
  }
  
  // Extract user ID from our simulated token
  const userId = token.replace('demo-token-', '');
  
  try {
    const { data } = await api.get<UserWithPassword>(`/users/${userId}`);
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = data;
    // Ensure role is of the correct type
    if (userWithoutPassword.role && 
        !["user", "admin", "editor"].includes(userWithoutPassword.role as string)) {
      userWithoutPassword.role = "user";
    }
    return userWithoutPassword as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    localStorage.removeItem('financeNewsAuthToken');
    return null;
  }
};

// Register a new user
export const register = async (userData: { 
  name: string; 
  email: string; 
  password: string;
}): Promise<User> => {
  try {
    // Check if email already exists
    const { data: existingUsers } = await api.get<UserWithPassword[]>('/users', {
      params: { email: userData.email }
    });
    
    if (existingUsers.length > 0) {
      throw new Error('Email already registered');
    }
    
    // Create new user with properly typed role
    const newUser = {
      ...userData,
      role: 'user' as 'user' | 'admin' | 'editor',
      createdAt: new Date().toISOString()
    };
    
    const { data } = await api.post<UserWithPassword>('/users', newUser);
    
    // Auto-login the user
    const token = `demo-token-${data.id}`;
    localStorage.setItem('financeNewsAuthToken', token);
    
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword as User;
  } catch (error) {
    console.error("Registration error:", error);
    
    // If server is unreachable, create a temporary mock user
    if (error.message === 'Network Error') {
      const mockId = `temp-${Date.now()}`;
      const mockUser = {
        id: mockId,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user' as 'user' | 'admin' | 'editor',
        avatar: `https://i.pravatar.cc/150?u=${mockId}`
      };
      
      // Store in localStorage temporarily
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      const token = `mock-token-${mockId}`;
      localStorage.setItem('financeNewsAuthToken', token);
      
      // Remove password before returning
      const { password: _, ...userWithoutPassword } = mockUser;
      return userWithoutPassword;
    }
    
    throw error;
  }
};
