'use client'; 

import { useState, useContext } from 'react'; 
import { useRouter } from 'next/navigation'; 
import AuthContext from '@/app/context/AuthContext'; 
import axios from 'axios';

const Login = () => { 
  const router = useRouter();
  const { login } = useContext(AuthContext); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [registerUsername, setRegisterUsername] = useState(''); 
  const [registerPassword, setRegisterPassword] = useState(''); 
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    try {
      // Check if login is a function before calling it
      if (typeof login === 'function') {
        await login(username, password);
        router.push('/dashboard'); // Redirect after successful login
      } else {
        console.error('Login function is not available');
        setError('Authentication service unavailable');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('Invalid username or password');
    }
  }; 

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    try {
      // Register the user with the correct endpoint
      const registerResponse = await axios.post('http://localhost:8000/auth/', {
        username: registerUsername, 
        password: registerPassword
      });
      
      console.log('Registration successful', registerResponse.data);
      
      // After successful registration, attempt to login
      if (typeof login === 'function') {
        await login(registerUsername, registerPassword);
        // The login function will handle the redirect
      } else {
        console.error('Login function is not available');
        setError('Authentication service unavailable');
      }
    } catch (error) { 
      console.error('Registration failed', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="username" 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Login
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-8">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="registerUsername" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="registerUsername"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Login; 