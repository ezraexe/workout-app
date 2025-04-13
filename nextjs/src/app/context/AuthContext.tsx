'use client'

import { createContext, useContext, useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation' 
import axios from 'axios' 
// import { User } from '@/fastapi/api/models' 

// First, define the context type
type AuthContextType = {
  user: any;  // Replace 'any' with your user type
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Then create context with the type
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => { 
  const [user, setUser] = useState(null); 
  const router = useRouter(); 

  const login = async (username: string, password: string) => { 
    try {
      const formData = new FormData(); 
      formData.append('username', username); 
      formData.append('password', password); 
      const response = await axios.post('http://localhost:8000/api/auth/token', formData, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      axios.defaults.headers.common['Authorization'] = 'Bearer ${response.data.access_token}'; 
      localStorage.setItem('token', response.data.access_token); 
      setUser(response.data);
      router.push('/'); 
    } catch (error) { 
      console.log('Login failed', error); 
    }
  }; 

  const logout = () => { 
    setUser(null);
    delete axios.defaults.headers.common['Authorization']; 
    localStorage.removeItem('token'); 
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}> 
      {children} 
    </AuthContext.Provider>
  );
};

export default AuthContext; 