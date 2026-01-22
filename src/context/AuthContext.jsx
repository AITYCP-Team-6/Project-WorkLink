import { createContext, useState, useEffect } from 'react';
//import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  

  const login = async (email, password) => {
    // REAL API CALL:
    // const response = await api.post('/auth/login', { email, password });
    // const { token, ...userData } = response.data;
    
    // MOCK LOGIN (For testing without backend):
    const mockUser = {
      id: 1,
      name: "Test User",
      email: email,
      role: email.includes("admin") ? "ADMIN" : email.includes("org") ? "ORGANIZATION" : "VOLUNTEER",
      token: "fake-jwt-token"
    };

    localStorage.setItem('token', mockUser.token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};