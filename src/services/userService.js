import axiosClient from '../api/axiosClient';

const userService = {
  getUsers: async (page = 0, size = 10, search = '', status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    
    const response = await axiosClient.get(`/api/admin/users?${params}`);
    return response;
  },

  getUserDetails: async (userId) => {
    const response = await axiosClient.get(`/api/admin/users/${userId}`);
    return response;
  },

  blockUser: async (userId, isBlocked, reason = '') => {
    try {
      console.log('Blocking user:', { userId, isBlocked, reason });
      const response = await axiosClient.put(`/api/admin/users/${userId}/block`, {
        isBlocked,
        reason
      });
      console.log('Block user API response:', response);
      return response;
    } catch (error) {
      console.error('Block user service error:', error);
      throw error;
    }
  },

  changeUserRole: async (userId, role) => {
    const response = await axiosClient.put(`/api/admin/users/${userId}/role`, {
      role
    });
    return response;
  },

  getUserStatistics: async () => {
    const response = await axiosClient.get('/api/admin/statistics/users');
    return response;
  }
};

export default userService;
