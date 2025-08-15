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
      const response = await axiosClient.put(`/api/admin/users/${userId}/block`, {
        isBlocked,
        reason
      });
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
  },

  getTotalLoginCount: async () => {
    try {
      // Lấy tất cả người dùng để tính tổng số lần đăng nhập
      const response = await axiosClient.get('/api/admin/users?size=1000');
      const users = response.content || [];
      
      // Tính tổng số lần đăng nhập
      const totalLoginCount = users.reduce((total, user) => {
        return total + (user.loginCount || 0);
      }, 0);
      
      return totalLoginCount;
    } catch (error) {
      console.error('Error getting total login count:', error);
      throw error;
    }
  }
};

export default userService;
