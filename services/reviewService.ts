import { apiCall } from '@/helpers/apiHelper';
import axiosClient from '@/helpers/axiosClient';

const endpoint = 'reviews';

export const addReviewAsync = async (
  placeId: number,
  userId: number,
  rating: number,
  comment: string
): Promise<any> => {
  try {
    return apiCall(async () => await axiosClient.post(endpoint, { placeId, userId, rating, comment }));
  } catch (err) {
    console.log(err);
  }
};
