import { apiCall } from '@/helpers/apiHelper';
import axiosClient from '@/helpers/axiosClient';
import { UserType } from '@/types/auth';

const endpoint = 'users';

export const getUserAsync = (username: string): Promise<UserType> => {
  return apiCall(async () => {
    const response = await axiosClient.get<UserType>(endpoint, { params: { username } });
    return response?.data;
  });
};
