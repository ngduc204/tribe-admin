import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role - chỉ cho phép admin truy cập
  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
      }}>
        <Result
          status="403"
          icon={<LockOutlined style={{ color: '#8b5cf6' }} />}
          title="Không có quyền truy cập"
          subTitle="Bạn không có quyền truy cập trang này. Đây là trang dành cho quản trị viên."
          extra={[
            <Button 
              type="primary" 
              key="logout" 
              icon={<LoginOutlined />}
              onClick={logout}
              style={{
                backgroundColor: '#8b5cf6',
                borderColor: '#8b5cf6',
                borderRadius: '8px',
                height: '40px',
                padding: '0 24px'
              }}
            >
              Đăng xuất
            </Button>
          ]}
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
