import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Alert, Typography, message, Result } from 'antd';
import { UserOutlined, LockOutlined, LockOutlined as LockIcon } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/authService';
import { getUserFromToken } from '../../utils/jwtUtils';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  // Kiểm tra URL parameter để hiển thị thông báo lỗi
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('error') === 'access_denied') {
      setAccessDenied(true);
    }
  }, [location]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage('');
    setAccessDenied(false);

    try {
      // Gọi API đăng nhập
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      // Validate response structure - API trả về JWT token trong data field
      if (!response || typeof response !== 'string') {
        throw new Error('Dữ liệu phản hồi không hợp lệ từ máy chủ.');
      }

      // Lấy thông tin user từ JWT token
      const userData = getUserFromToken(response);
      if (!userData) {
        throw new Error('Không thể xác thực thông tin người dùng từ token.');
      }

      // Kiểm tra role - chỉ cho phép admin đăng nhập
      if (userData.role !== 'ROLE_ADMIN') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // Lưu token và thông tin user vào AuthContext
      authLogin(response, userData);
      
      // Hiển thị thông báo thành công
      message.success('Đăng nhập thành công! Chào mừng bạn trở lại.');
      
      // Điều hướng về trang chủ
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trang thông báo không có quyền truy cập
  if (accessDenied) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card 
            style={{ 
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)', 
              borderRadius: '16px',
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Result
              status="403"
              icon={<LockIcon style={{ color: '#8b5cf6' }} />}
              title="Không có quyền truy cập"
              subTitle="Bạn không có quyền truy cập hệ thống này. Đây là trang dành cho quản trị viên."
              extra={[
                <Button 
                  type="primary" 
                  key="back" 
                  onClick={() => {
                    setAccessDenied(false);
                    navigate('/login', { replace: true });
                  }}
                  style={{
                    backgroundColor: '#8b5cf6',
                    borderColor: '#8b5cf6',
                    borderRadius: '8px',
                    height: '40px',
                    padding: '0 24px'
                  }}
                >
                  Quay lại đăng nhập
                </Button>
              ]}
            />
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card 
          style={{ 
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)', 
            borderRadius: '16px',
            border: 'none',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#8b5cf6', marginBottom: '8px', fontWeight: 'bold' }}>
              Tribe Admin
            </Title>
            <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>Đăng nhập để truy cập hệ thống quản trị</p>
          </div>

          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 24, borderRadius: '8px' }}
              closable
              onClose={() => setErrorMessage('')}
            />
          )}
          
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#8b5cf6' }} />}
                placeholder="admin@example.com"
                autoFocus
                style={{ borderRadius: '8px', borderColor: '#c4b5fd' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8b5cf6' }} />}
                placeholder="Nhập mật khẩu của bạn"
                style={{ borderRadius: '8px', borderColor: '#c4b5fd' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ 
                  height: '48px', 
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  backgroundColor: '#8b5cf6',
                  borderColor: '#8b5cf6',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
              Chỉ quản trị viên mới có quyền truy cập hệ thống này
            </p>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
