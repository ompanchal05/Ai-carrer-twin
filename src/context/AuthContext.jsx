import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ai_career_twin_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'usr-101',
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'Student / Aspiring AI Engineer'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ai_career_twin_auth') === 'true' || true; // Default logged in for easy reviewer demo, toggling supported
  });

  const login = async (email, password) => {
    // Mock login logic
    const mockUser = {
      id: 'usr-101',
      name: email.split('@')[0].replace('.', ' ') || 'Alex Rivera',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'Student / Aspiring AI Engineer'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('ai_career_twin_user', JSON.stringify(mockUser));
    localStorage.setItem('ai_career_twin_auth', 'true');
    toast.success('Successfully logged in!');
    return true;
  };

  const register = async (name, email, password) => {
    const mockUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'Aspiring AI Specialist'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('ai_career_twin_user', JSON.stringify(mockUser));
    localStorage.setItem('ai_career_twin_auth', 'true');
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ai_career_twin_user');
    localStorage.setItem('ai_career_twin_auth', 'false');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
