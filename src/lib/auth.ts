import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      register: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // For demo, we'll simulate a delay and store in localStorage
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          // Check if user already exists
          if (users.some((u: User) => u.email === email)) {
            throw new Error('User already exists');
          }
          
          const newUser = {
            id: `user-${Date.now()}`,
            email,
          };
          
          users.push({ ...newUser, password }); // In real app, NEVER store plain passwords
          localStorage.setItem('users', JSON.stringify(users));
          
          set({ 
            user: newUser,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
        }
      },
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find((u: any) => 
            u.email === email && u.password === password
          );
          
          if (!user) {
            throw new Error('Invalid email or password');
          }
          
          const { password: _, ...userWithoutPassword } = user;
          
          set({ 
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
        }
      },
      signOut: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);