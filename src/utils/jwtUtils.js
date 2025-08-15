// Utility function để decode JWT token
export const decodeJWT = (token) => {
  try {
    // JWT token có format: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Lấy thông tin user từ JWT token
export const getUserFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return null;
  }
  
  return {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role
  };
};
