import axiosClient from '../api/axiosClient';

const authService = {
  login: async (email, password) => {
    const response = await axiosClient.post('/api/auth/login', {
      email,
      password
    });
    return response;
  }
};

export default authService;
