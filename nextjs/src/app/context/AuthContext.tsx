'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react' 
import { useRouter } from 'next/navigation' 
import axios from 'axios' 
// import { User } from '@/fastapi/api/models' 

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
};

// Then create context with the type
const AuthContext = createContext<AuthContextType>(defaultValue);

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user data here
    }
  }, []);

  const login = async (username: string, password: string) => { 
    try {
      // Using form data as it was in the original implementation
      const formData = new FormData(); 
      formData.append('username', username); 
      formData.append('password', password); 
      
      // Correct endpoint URL based on FastAPI router definition
      const response = await axios.post('http://localhost:8000/auth/token', formData, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Set the authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`; 
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.access_token); 
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.data);
      
      router.push('/dashboard'); 
    } catch (error) { 
      console.error('Login failed:', error);
      throw error;
    }
  }; 

  const logout = () => { 
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Update state
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}> 
      {children} 
    </AuthContext.Provider>
  );
};

export default AuthContext; 