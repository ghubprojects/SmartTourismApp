import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { ErrorMsg, ErrorTitle } from '@/resources/ErrorMsg';
import { appRoutes } from '@/routes';
import { authService, userService } from '@/services';
import { JwtPayload, UserType } from '@/types/auth';

export interface AuthContextType {
  user: UserType | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  const handleError = (message: string, error: any) => {
    console.log(message, error);
    Alert.alert(ErrorTitle.default, message);
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('check Auth', token);
    if (token) {
      const decoded: JwtPayload = jwtDecode(token);
      const username = decoded.name;
      const data = await userService.getUserAsync(username);
      setUser(data);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    router.replace(appRoutes.index);
  }, []);

  const login = async (username: string, password: string) => {
    const { user, token } = await authService.loginAsync(username, password);
    await AsyncStorage.setItem('token', token);
    setUser(user);
    return true;
  };

  const register = async (username: string, password: string, email: string) => {
    await authService.registerAsync(username, password, email);
    return true;
  };

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      return true;
    } catch (error) {
      handleError(ErrorMsg.logoutFailed, error);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkAuth }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
