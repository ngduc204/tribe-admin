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
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #303030'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'AD' : 'Admin'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space>
              <div style={{ fontSize: '14px', fontWeight: '500', paddingRight: '20px'}}>
                {user?.name || user?.email || 'Admin User'}
              </div>
            <Avatar icon={<UserOutlined />} />
            <Button 
              type="text" 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#ff4d4f' }}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          minHeight: '280px'
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
        okType="danger"
      >
        <p>Bạn có chắc muốn đăng xuất khỏi hệ thống?</p>
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
