import { apiCall } from '@/helpers/apiHelper';
import axiosClient from '@/helpers/axiosClient';
import { AuthState } from '@/types/auth';
import { AxiosResponse } from 'axios';

const endpoint = 'auth';

export const loginAsync = async (username: string, password: string): Promise<any> => {
  return apiCall(async () => {
    const response = await axiosClient.post<AuthState>(`${endpoint}/login`, { username, password });
    return response?.data;
  });
};

export const registerAsync = async (
  username: string,
  password: string,
  email: string
): Promise<AxiosResponse> => {
  return apiCall(async () => await axiosClient.post(`${endpoint}/register`, { username, password, email }));
};
