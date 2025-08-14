import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Alert, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/authService';
import { getUserFromToken } from '../../utils/jwtUtils';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage('');

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

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card 
          style={{ 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
            borderRadius: '12px',
            border: 'none'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
              Admin Dashboard
            </Title>
            <p style={{ color: '#666', margin: 0 }}>Đăng nhập để truy cập hệ thống quản trị</p>
          </div>

          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
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
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="admin@example.com"
                autoFocus
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
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nhập mật khẩu của bạn"
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
                  borderRadius: '8px'
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
              Sử dụng thông tin đăng nhập được cung cấp bởi quản trị viên
            </p>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
