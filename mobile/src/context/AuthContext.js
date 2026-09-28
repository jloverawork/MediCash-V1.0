import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@medicash_user');
      const storedToken = await AsyncStorage.getItem('@medicash_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.log('Error loading auth state:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, tokenData) => {
    try {
      setUser(userData);
      setToken(tokenData);
      await AsyncStorage.setItem('@medicash_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@medicash_token', tokenData);
    } catch (e) {
      console.log('Error saving auth state:', e);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('@medicash_user');
      await AsyncStorage.removeItem('@medicash_token');
    } catch (e) {
      console.log('Error removing auth state:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
