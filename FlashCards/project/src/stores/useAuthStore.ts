import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  login: async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });
      
      if (error) {
        console.error('Login error:', error);
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        throw new Error(error.message);
      }
      
      if (user) {
        // Get user profile from users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Error fetching user profile');
        }
          
        if (profile) {
          set({ 
            user: profile,
            isAuthenticated: true,
            error: null 
          });
        } else {
          throw new Error('User profile not found');
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid email or password';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  
  register: async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        throw new Error(error.message);
      }
      
      if (user) {
        // Create user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: user.id,
              name: email.split('@')[0], // Use part before @ as name
            }
          ])
          .select()
          .single();
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Error creating user profile');
        }
        
        if (profile) {
          set({ 
            user: profile,
            isAuthenticated: true,
            error: null 
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Email already taken';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error: any) {
      const errorMessage = error.message || 'Error during logout';
      set({ error: errorMessage });
      throw error;
    }
  },
  
  initAuth: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session fetch error:', sessionError);
        throw sessionError;
      }
      
      if (session?.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }
          
        if (profile) {
          set({ 
            user: profile,
            isAuthenticated: true,
            error: null 
          });
        }
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Error initializing authentication';
      set({ error: errorMessage, isLoading: false });
    }
  }
}));