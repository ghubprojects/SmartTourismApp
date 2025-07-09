export const apiCall = async <T>(apiFunc: () => Promise<T>): Promise<T> => {
  try {
    const response = await apiFunc();
    return response;
  } catch (error) {
    console.log('API Call Error:', JSON.stringify(error));
    throw error;
  }
};
