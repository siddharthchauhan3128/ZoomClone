/* eslint-disable no-unused-vars */
import { createContext, useState, useContext } from 'react';
import servers from '../environment';

// 1. Create the Context
const AuthContext = createContext();

// IMPROVEMENT: Save your API URL here so it's easy to change later when you deploy!
const API_URL = `${servers}`;

export const AuthProvider = ({ children }) => {
  
  // 🌟 FIX: Lazy State Initialization. 
  // By passing a function into useState, it runs ONCE instantly.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedUser !== 'undefined' && storedToken) {
        return JSON.parse(storedUser); // This puts it directly into the 'user' state!
      }
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return null; // Start empty if no valid user is found
  });

  // Notice we deleted the useEffect entirely! We don't need it anymore.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    try {
      // IMPROVEMENT: Use the API_URL variable
      const response = await fetch(`${API_URL}/api/auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("THE BACKEND SENT ME EXACTLY THIS:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in');
      }
      const user = data.user || data; // Fallback if user is at root
    const userId = user._id || user.id; // Fallback if the field is named 'id'

    if (!userId) {
        throw new Error("Login successful, but User ID is missing from response.");
    }

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', data.user.token); 
    
      return { success: true, userId: data.user._id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }

  const register = async (userData) => {
    setError(null);
    try {
      // IMPROVEMENT: Use the API_URL variable
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      setUser(data.user);
      console.log("userData :",data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.user.token);

      return { success: true, userId: data.user._id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);