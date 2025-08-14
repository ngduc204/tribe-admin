import axiosClient from './axiosClient';

export const authService = {
  login: async (credentials) => {
    return axiosClient.post('/api/auth/login', credentials);
  },
};
