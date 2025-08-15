import React, { createContext, useState, useEffect } from 'react';

// Tạo AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Khởi tạo state từ localStorage
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData && userData !== 'undefined' ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  // Theo dõi thay đổi của token và cập nhật localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
  }, [token]);

  // Hàm login
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Hàm logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Giá trị context
  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



export default AuthContext;
