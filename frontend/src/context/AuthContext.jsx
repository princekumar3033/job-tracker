import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('jt_token');
    const storedUser = localStorage.getItem('jt_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse cached auth user data:', e);
        localStorage.removeItem('jt_token');
        localStorage.removeItem('jt_user');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      // Save token and user info
      localStorage.setItem('jt_token', data.token);
      localStorage.setItem('jt_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      // Save token and user info
      localStorage.setItem('jt_token', data.token);
      localStorage.setItem('jt_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('jt_token');
    localStorage.removeItem('jt_user');
    setToken(null);
    setUser(null);
  };

  // Automated custom fetch wrapper that injects standard JWT token
  const authFetch = async (endpoint, options = {}) => {
    const storedToken = token || localStorage.getItem('jt_token');
    
    if (!storedToken) {
      logout();
      throw new Error('No authentication token found. Please log in.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${storedToken}`,
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error('Your session expired. Please log in again.');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed.');
    }

    return data;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
