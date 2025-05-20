import { api } from './api';
import { User } from '@/components/Layout';
import { toast } from "sonner";

// Mock users for offline/demo mode
const MOCK_USERS = [
  {
    id: "mock-user-1",
    name: "Usuário Demonstração",
    email: "demo@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?u=demo",
    role: "user" as "user" | "admin" | "editor",
    status: "active" as "active" | "banned"
  },
  {
    id: "mock-admin-1",
    name: "Admin Demonstração",
    email: "admin@example.com",
    password: "admin123",
    avatar: "https://i.pravatar.cc/150?u=admin",
    role: "admin" as "user" | "admin" | "editor",
    status: "active" as "active" | "banned"
  }
];

// Extended User type for auth operations that include password
interface UserWithPassword extends User {
  password: string;
  status?: "active" | "banned";
}

// Authentication endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  USERS: '/users'
};

// Modified login service to use POST method with credentials
export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Login attempt for:', email);
    
    // First try to authenticate using JSON Server's limited auth capabilities
    // JSON Server retorna um array de usuários, precisamos verificar isso
    const { data: users } = await api.get<UserWithPassword[]>(AUTH_ENDPOINTS.USERS, {
      params: { 
        email: email // Usar filtro exato em vez de email_like para melhor precisão
      }
    });
    
    console.log('Users found:', users);
    
    // Verificar se o array de usuários tem pelo menos um usuário
    if (!Array.isArray(users) || users.length === 0) {
      console.error('No users found with email:', email);
      throw new Error('Credenciais inválidas ou usuário não encontrado');
    }
    
    // Encontrar o usuário com email e senha correspondentes
    const user = users.find(u => 
      u.email && u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password &&
      u.status !== "banned"
    );
    
    if (!user) {
      console.error('Password mismatch or user is banned');
      throw new Error('Credenciais inválidas ou usuário não encontrado');
    }

    // Check if user is banned
    if (user.status === "banned") {
      console.error('User is banned:', user.id);
      throw new Error('Esta conta foi suspensa. Entre em contato com o suporte.');
    }

    console.log('Login successful for user:', user.id);
    
    // Generate a token (in a real app, the server would return this)
    const token = `demo-token-${user.id}`;
    localStorage.setItem('financeNewsAuthToken', token);
    localStorage.setItem('financeNewsUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }));
    
    // Remove password before returning the user
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error: any) {
    console.error("Login error:", error);
    
    // If server is unreachable, try mock users for demo mode
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      const mockUser = MOCK_USERS.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
      );
      
      if (mockUser) {
        console.log("Using mock user for demo mode:", mockUser.id);
        const token = `mock-token-${mockUser.id}`;
        localStorage.setItem('financeNewsAuthToken', token);
        localStorage.setItem('financeNewsUser', JSON.stringify({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar
        }));
        
        // Remove password before returning
        const { password: _, ...userWithoutPassword } = mockUser;
        return userWithoutPassword;
      }
    }
    
    // Re-throw with a user-friendly message
    if (error.userMessage) {
      throw new Error(error.userMessage);
    }
    throw new Error('Falha no login. Verifique suas credenciais.');
  }
};

export const logout = () => {
  console.log('User logout');
  localStorage.removeItem('financeNewsAuthToken');
  localStorage.removeItem('financeNewsUser');
};

// Get the current user based on the stored token
export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('financeNewsAuthToken');
  if (!token) return null;
  
  // Try to get cached user from localStorage first
  const cachedUser = localStorage.getItem('financeNewsUser');
  let user: User | null = null;
  
  if (cachedUser) {
    try {
      user = JSON.parse(cachedUser) as User;
      console.log('Using cached user data:', user.id);
    } catch (e) {
      console.error('Error parsing cached user:', e);
      localStorage.removeItem('financeNewsUser');
    }
  }
  
  // Check if it's a mock token
  if (token.startsWith('mock-token-')) {
    const mockUserId = token.replace('mock-token-', '');
    const mockUser = MOCK_USERS.find(user => user.id === mockUserId);
    
    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser;
      console.log('Using mock user from token:', mockUser.id);
      return userWithoutPassword;
    }
    
    return user;
  }
  
  // Extract user ID from our simulated token
  const userId = token.replace('demo-token-', '');
  
  try {
    console.log('Fetching current user data for ID:', userId);
    const { data } = await api.get<UserWithPassword>(`${AUTH_ENDPOINTS.USERS}/${userId}`);
    
    // Check if user is banned
    if (data.status === "banned") {
      console.error('User is banned:', data.id);
      toast.error('Esta conta foi suspensa. Entre em contato com o suporte.');
      logout();
      return null;
    }
    
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = data;
    
    // Ensure role is of the correct type
    if (userWithoutPassword.role && 
        !["user", "admin", "editor"].includes(userWithoutPassword.role as string)) {
      userWithoutPassword.role = "user" as "user" | "admin" | "editor";
    }
    
    // Update cached user
    localStorage.setItem('financeNewsUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    
    // Return cached user data if available and API fails
    if (user) {
      console.log('Returning cached user data due to API error');
      return user;
    }
    
    // Otherwise clear auth data
    localStorage.removeItem('financeNewsAuthToken');
    localStorage.removeItem('financeNewsUser');
    return null;
  }
};

// Register a new user - Using proper POST method
export const register = async (userData: { 
  name: string; 
  email: string; 
  password: string;
}): Promise<User> => {
  try {
    console.log('Registering new user:', userData.email);
    
    // Check if email already exists (case insensitive)
    const { data: existingUsers } = await api.get<UserWithPassword[]>(AUTH_ENDPOINTS.USERS, {
      params: { email: userData.email }
    });
    
    const emailExists = existingUsers.some(user => 
      user.email && user.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (emailExists) {
      console.error('Email already registered:', userData.email);
      throw new Error('Email já registrado');
    }
    
    // Create new user with properly typed role and status
    const newUser = {
      ...userData,
      role: 'user' as 'user' | 'admin' | 'editor',
      status: 'active' as 'active' | 'banned',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // Use POST to create the user
    const { data } = await api.post<UserWithPassword>(AUTH_ENDPOINTS.USERS, newUser);
    console.log('User registered successfully:', data.id);
    
    // Auto-login the user
    const token = `demo-token-${data.id}`;
    localStorage.setItem('financeNewsAuthToken', token);
    localStorage.setItem('financeNewsUser', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar
    }));
    
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword as User;
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // If server is unreachable, create a temporary mock user
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      console.log('Creating offline mock user due to network error');
      
      const mockId = `temp-${Date.now()}`;
      const mockUser = {
        id: mockId,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user' as 'user' | 'admin' | 'editor',
        status: 'active' as 'active' | 'banned',
        avatar: `https://i.pravatar.cc/150?u=${mockId}`
      };
      
      // Store in localStorage temporarily
      const offlineUsers = JSON.parse(localStorage.getItem('offlineUsers') || '[]');
      offlineUsers.push(mockUser);
      localStorage.setItem('offlineUsers', JSON.stringify(offlineUsers));
      
      const token = `mock-token-${mockId}`;
      localStorage.setItem('financeNewsAuthToken', token);
      localStorage.setItem('financeNewsUser', JSON.stringify({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar
      }));
      
      toast.info('Cadastro realizado em modo offline. Seus dados serão sincronizados quando a conexão for restaurada.', {
        duration: 5000
      });
      
      // Remove password before returning
      const { password: _, ...userWithoutPassword } = mockUser;
      return userWithoutPassword;
    }
    
    // Re-throw with a user-friendly message
    if (error.userMessage) {
      throw new Error(error.userMessage);
    }
    throw error;
  }
};

// Function to sync offline users when connection is restored
export const syncOfflineUsers = async (): Promise<void> => {
  try {
    const offlineUsers = JSON.parse(localStorage.getItem('offlineUsers') || '[]');
    if (offlineUsers.length === 0) return;
    
    console.log('Attempting to sync offline users:', offlineUsers.length);
    
    for (const user of offlineUsers) {
      try {
        // Check if the user already exists on server
        const { data: existingUsers } = await api.get<UserWithPassword[]>(AUTH_ENDPOINTS.USERS, {
          params: { email: user.email }
        });
        
        if (existingUsers.length === 0) {
          // User doesn't exist, create it
          await api.post(AUTH_ENDPOINTS.USERS, user);
          console.log('Synced offline user:', user.email);
        } else {
          console.log('User already exists on server:', user.email);
        }
      } catch (error) {
        console.error('Error syncing individual user:', user.email, error);
      }
    }
    
    // Clear offline users
    localStorage.removeItem('offlineUsers');
    toast.success('Dados offline sincronizados com sucesso!');
  } catch (error) {
    console.error('Error syncing offline users:', error);
  }
};

// Try to sync offline users on app startup
setTimeout(() => {
  syncOfflineUsers();
}, 5000);
