import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, Spin, Alert, Button, message } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  StopOutlined, 
  UserAddOutlined,
  CrownOutlined,
  ReloadOutlined,
  LoginOutlined
} from '@ant-design/icons';
import userService from '../../services/userService';

const { Title } = Typography;

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [totalLoginCount, setTotalLoginCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsResponse, loginCount] = await Promise.all([
        userService.getUserStatistics(),
        userService.getTotalLoginCount()
      ]);
      
      console.log('Statistics response:', statsResponse);
      console.log('Total login count:', loginCount);
      
      setStats(statsResponse);
      setTotalLoginCount(loginCount);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleRefresh = async () => {
    try {
      await fetchStatistics();
      message.success('Đã làm mới thống kê thành công');
    } catch {
      // Error đã được xử lý trong fetchStatistics
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thống kê...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button 
              size="small" 
              danger 
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Thống kê người dùng</Title>
        <p style={{ color: '#666', margin: 0 }}>
          Tổng quan về tình hình người dùng trong hệ thống
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Tổng số người dùng */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* Người dùng hoạt động */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={stats?.activeUsers || 0}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        {/* Người dùng bị chặn */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng bị chặn"
              value={stats?.blockedUsers || 0}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        {/* Người dùng mới hôm nay */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng mới hôm nay"
              value={stats?.newUsersToday || 0}
              prefix={<UserAddOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        {/* Quản trị viên */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Quản trị viên"
              value={stats?.adminUsers || 0}
              prefix={<CrownOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        {/* Tổng số lần truy cập */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số lần truy cập"
              value={totalLoginCount}
              prefix={<LoginOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>

        {/* Tỷ lệ hoạt động */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoạt động"
              value={stats?.totalUsers > 0 ? ((stats?.activeUsers / stats?.totalUsers) * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<TeamOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>

        {/* Tỷ lệ bị chặn */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ bị chặn"
              value={stats?.totalUsers > 0 ? ((stats?.blockedUsers / stats?.totalUsers) * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<StopOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>

        {/* Tỷ lệ quản trị viên */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ quản trị viên"
              value={stats?.totalUsers > 0 ? ((stats?.adminUsers / stats?.totalUsers) * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<CrownOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>

        {/* Trung bình truy cập/người dùng */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="TB truy cập/người dùng"
              value={stats?.totalUsers > 0 ? (totalLoginCount / stats?.totalUsers).toFixed(1) : 0}
              prefix={<LoginOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Nút làm mới */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          Làm mới thống kê
        </Button>
      </div>
    </div>
  );
};

export default StatisticsPage;
