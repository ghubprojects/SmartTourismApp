import { apiCall } from '@/helpers/apiHelper';
import axiosClient from '@/helpers/axiosClient';
import { PlaceDetailType } from '@/types/place';

const endpoint = 'places';

export const getPlacesAsync = (filters?: {
  type?: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
}): Promise<PlaceDetailType[]> => {
  return apiCall(async () => {
    const response = await axiosClient.get<PlaceDetailType[]>(endpoint, { params: filters });

    return response?.data;
  });
};

export const getTypesAsync = (): Promise<string[]> => {
  return apiCall(async () => {
    const response = await axiosClient.get<string[]>(`${endpoint}/types`);
    return response?.data;
  });
};
