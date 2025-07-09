import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { WebRootPath } from '@/constants/WebRootPath';
import { ErrorMsg, ErrorTitle } from '@/resources/ErrorMsg';
import { authRoutes } from '@/routes';

// Tạo instance của axios
const axiosClient = axios.create({
  baseURL: WebRootPath.basePath,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log('Request interceptor error:', error);
  }
  return config;
};

// Response interceptor
const onResponseError = async (error: any): Promise<any> => {
  const status = error.response?.status;
  if (status === 401) {
    Alert.alert(ErrorTitle.sessionExpired, ErrorMsg.sessionExpired, [
      {
        text: 'OK',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          router.replace(authRoutes.login);
        },
      },
    ]);
  }
  return Promise.reject(error);
};

// Gắn các interceptor
axiosClient.interceptors.request.use(onRequest, (error) => {
  console.log('Request error:', error);
  return Promise.reject(error);
});

axiosClient.interceptors.response.use((response: AxiosResponse) => response, onResponseError);

export default axiosClient;
