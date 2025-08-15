import React from 'react';
import { Layout, Menu, Button, Row, Col, Avatar, Typography, Space, message } from 'antd';
import { Modal } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

  // Cấu hình menu items
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Thống kê</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">Quản lý người dùng</Link>,
    },
  ];

  const handleLogout = () => {
    console.log('gọi hàm handleLogout');
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    console.log('Xác nhận đăng xuất');
    logout();
    message.success('Đã đăng xuất thành công');
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    console.log('Hủy đăng xuất');
    setLogoutModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>
            {collapsed ? 'TA' : 'Tribe Admin'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            borderRight: 0,
            background: 'transparent'
          }}
          className="custom-menu"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: 'linear-gradient(90deg, #faf5ff 0%, #f8fafc 100%)', 
          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e7ff'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#8b5cf6'
            }}
          />
          
          <Space>
              <div style={{ fontSize: '14px', fontWeight: '500', paddingRight: '20px', color: '#8b5cf6'}}>
                {user?.name || user?.email || 'Tribe Admin'}
              </div>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#8b5cf6' }} />
            <Button 
              type="text" 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#8b5cf6' }}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px 16px',
          padding: '24px',
          background: '#faf5ff',
          borderRadius: '12px',
          minHeight: '280px',
          border: '1px solid #e0e7ff'
        }}>
          <Outlet />
        </Content>
      </Layout>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Xác nhận đăng xuất"
        open={logoutModalVisible}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okType="primary"
        okButtonProps={{ style: { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' } }}
      >
        <p>Bạn có chắc muốn đăng xuất khỏi hệ thống Tribe Admin?</p>
      </Modal>

      <style jsx>{`
        .custom-menu .ant-menu-item {
          color: rgba(255,255,255,0.9) !important;
        }
        .custom-menu .ant-menu-item:hover {
          background-color: rgba(255,255,255,0.15) !important;
          color: white !important;
        }
        .custom-menu .ant-menu-item-selected {
          background-color: rgba(255,255,255,0.25) !important;
          color: white !important;
        }
      `}</style>
    </Layout>
  );
};

export default AdminLayout;
