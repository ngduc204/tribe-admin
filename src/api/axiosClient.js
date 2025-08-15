import axios from 'axios';

// Tạo instance Axios với cấu hình cơ bản
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tự động thêm JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response theo cấu trúc API
axiosClient.interceptors.response.use(
  (response) => {
    // Kiểm tra cấu trúc response từ API
    if (response.data && response.data.status) {
      if (response.data.status.success) {
        // Trường hợp thành công - chỉ trả về phần data
        return response.data.data;
      } else {
        // Trường hợp thất bại logic - reject với thông điệp lỗi
        return Promise.reject(new Error(response.data.status.displayMessage));
      }
    }
    
    // Nếu không có cấu trúc status, trả về response.data
    return response.data;
  },
  (error) => {
    // Trường hợp thất bại HTTP (4xx, 5xx) hoặc lỗi mạng
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
         if (error.response) {
       // Có response từ server
       const { status } = error.response;
       
       // Handle 401 Unauthorized (token expired or invalid)
       if (status === 401) {
         // Clear authentication data
         localStorage.removeItem('authToken');
         localStorage.removeItem('user');
         
         // Redirect to login if not already there
         if (window.location.pathname !== '/login') {
           window.location.href = '/login';
         }
       }
       
       if (error.response.data && error.response.data.status) {
         errorMessage = error.response.data.status.displayMessage;
       } else if (error.response.data && error.response.data.message) {
         errorMessage = error.response.data.message;
       } else {
         errorMessage = `Lỗi ${error.response.status}: ${error.response.statusText}`;
       }
          } else if (error.request) {
       // Không có response từ server (lỗi mạng)
       errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
     } else {
      // Lỗi khác
      errorMessage = error.message;
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
