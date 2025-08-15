import React, { useState, useEffect } from 'react';
import { Table, Tag, Avatar, Typography, Space, Input, Select, Row, Col, Button, Modal, message } from 'antd';
import { UserOutlined, SearchOutlined, ReloadOutlined, StopOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import userService from '../../services/userService';

const { Text } = Typography;
const { Search } = Input;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [blockingUsers, setBlockingUsers] = useState(new Set()); // Track which users are being blocked
  const [changingRoleUsers, setChangingRoleUsers] = useState(new Set()); // Track which users are having role changed
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockModalData, setBlockModalData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });



  const fetchUsers = async (page = 0, pageSize = 10, search = '', status = '') => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, pageSize, search, status);
      setUsers(response.content || []);
      setPagination({
        current: response.pageable?.pageNumber + 1 || 1,
        pageSize: response.pageable?.pageSize || 10,
        total: response.pageable?.totalElements || 0,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, 10, searchKey, statusFilter);
  }, [searchKey, statusFilter]);

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    fetchUsers(current - 1, pageSize, searchKey, statusFilter);
  };

  const handleSearch = async (value) => {
    setSearchKey(value);
    setSearchLoading(true);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset về trang 1
    try {
      await fetchUsers(0, pagination.pageSize, value, statusFilter);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStatusFilterChange = async (value) => {
    setStatusFilter(value);
    setSearchLoading(true);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset về trang 1
    try {
      await fetchUsers(0, pagination.pageSize, searchKey, value);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchKey('');
    setStatusFilter('');
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers(0, pagination.pageSize, '', '');
  };

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleModalVisible(true);
  };

  const handleRoleModalOk = async () => {
    if (!selectedUser || !newRole || newRole === selectedUser.role) {
      setRoleModalVisible(false);
      return;
    }

    // Add user to changing role set
    setChangingRoleUsers(prev => new Set(prev).add(selectedUser.id));

    try {
      await userService.changeUserRole(selectedUser.id, newRole);
      message.success(`Đã thay đổi vai trò người dùng thành công`);
      
      // Refresh data
      await fetchUsers(pagination.current - 1, pagination.pageSize, searchKey, statusFilter);
      
      // Close modal
      setRoleModalVisible(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      console.error('Error changing user role:', error);
      message.error(`Không thể thay đổi vai trò người dùng: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      // Remove user from changing role set
      setChangingRoleUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedUser.id);
        return newSet;
      });
    }
  };

  const handleRoleModalCancel = () => {
    setRoleModalVisible(false);
    setSelectedUser(null);
    setNewRole('');
  };

  const handleBlockUser = (userId, isBlocked, userName) => {
    console.log('gọi hàm handleBlockUser');

    if (!userId) {
      message.error('ID người dùng không hợp lệ');
      return;
    }
    
    const action = isBlocked ? 'bỏ chặn' : 'chặn';
    const content = `Bạn có chắc muốn ${action} người dùng "${userName}" không?`;

    setBlockModalData({
      userId,
      isBlocked,
      userName,
      action,
      content
    });
    setBlockModalVisible(true);
  };

  const handleBlockModalOk = async () => {
    if (!blockModalData) return;

    const { userId, isBlocked, action } = blockModalData;
    setBlockingUsers(prev => new Set(prev).add(userId));
    
    try {
      await userService.blockUser(userId, !isBlocked, `Được ${action} bởi admin`);
      message.success(`Đã ${action} người dùng thành công`);
      await fetchUsers(pagination.current - 1, pagination.pageSize, searchKey, statusFilter);
    } catch (error) {
      console.error('Error blocking user:', error);
      message.error(`Không thể ${action} người dùng: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setBlockingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
    
    setBlockModalVisible(false);
    setBlockModalData(null);
  };

  const handleBlockModalCancel = () => {
    setBlockModalVisible(false);
    setBlockModalData(null);
  };

  const getStatusTag = (status, isBlocked) => {
    if (isBlocked) {
      return <Tag color="red">Bị chặn</Tag>;
    }
    return status === 'active' ? (
      <Tag color="green">Hoạt động</Tag>
    ) : (
      <Tag color="orange">Không hoạt động</Tag>
    );
  };

  const getRoleTag = (role) => {
    const roleColors = {
      'ROLE_ADMIN': 'red',
      'ROLE_USER': 'blue',
    };
    return (
      <Tag color={roleColors[role] || 'default'}>
        {role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Người dùng'}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.avatarUrl} 
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <div style={{ fontWeight: '500' }}>{record.displayName}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id?.slice(0, 8)}...
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <Text copyable>{email}</Text>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone) => phone || <Text type="secondary">-</Text>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusTag(record.status, record.isBlocked),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => getRoleTag(role),
    },
    {
      title: 'Lần đăng nhập cuối',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : <Text type="secondary">-</Text>,
    },
    {
      title: 'Số lần đăng nhập',
      dataIndex: 'loginCount',
      key: 'loginCount',
      render: (count) => count || 0,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const isBlocking = blockingUsers.has(record.id);
        const isChangingRole = changingRoleUsers.has(record.id);
        return (
          <Space>
            <Button
              type={record.isBlocked ? 'default' : 'primary'}
              danger={!record.isBlocked}
              icon={record.isBlocked ? <CheckCircleOutlined /> : <StopOutlined />}
              size="small"
              loading={isBlocking}
              disabled={isBlocking || isChangingRole}
              onClick={() => {
                handleBlockUser(record.id, record.isBlocked, record.displayName);
              }}
            >
              {record.isBlocked ? 'Bỏ chặn' : 'Chặn'}
            </Button>
            <Button
              type="default"
              icon={<TeamOutlined />}
              size="small"
              loading={isChangingRole}
              disabled={isBlocking || isChangingRole}
              onClick={() => {
                handleChangeRole(record);
              }}
            >
              Đổi vai trò
            </Button>
          </Space>
        );
      },
    },
  ];



  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Quản lý người dùng - Tribe Admin</Typography.Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Tổng cộng {pagination.total} người dùng
        </Text>

      </div>

      {/* Search and Filter Section */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Tìm kiếm theo tên..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onSearch={handleSearch}
            loading={searchLoading}
            style={{ borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            size="large"
            style={{ width: '100%', borderRadius: '8px' }}
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={[
              { value: 'active', label: 'Hoạt động' },
              { value: 'inactive', label: 'Không hoạt động' },
            ]}
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={6}>
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
            style={{ 
              width: '100%', 
              borderRadius: '8px',
              backgroundColor: '#8b5cf6',
              borderColor: '#8b5cf6',
              color: 'white'
            }}
          >
            Làm mới
          </Button>
        </Col>
      </Row>
      
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} người dùng`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 1400 }}
        style={{ borderRadius: '12px' }}

      />

      {/* Modal thay đổi vai trò */}
      <Modal
        title="Thay đổi vai trò người dùng"
        open={roleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={handleRoleModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={changingRoleUsers.has(selectedUser?.id)}
        okButtonProps={{ style: { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' } }}
      >
        {selectedUser && (
          <div>
            <p>
              <strong>Người dùng:</strong> {selectedUser.displayName} ({selectedUser.email})
            </p>
            <p>
              <strong>Vai trò hiện tại:</strong> {selectedUser.role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Người dùng'}
            </p>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <strong>Vai trò mới:</strong>
              </label>
              <Select
                value={newRole}
                onChange={setNewRole}
                style={{ width: '100%' }}
                placeholder="Chọn vai trò mới"
              >
                <Select.Option value="ROLE_USER">Người dùng</Select.Option>
                <Select.Option value="ROLE_ADMIN">Quản trị viên</Select.Option>
              </Select>
            </div>
            {newRole && newRole !== selectedUser.role && (
              <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
                <p style={{ margin: 0, color: '#52c41a' }}>
                  <strong>Thay đổi:</strong> Từ "{selectedUser.role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Người dùng'}" 
                  thành "{newRole === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Người dùng'}"
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal chặn/bỏ chặn người dùng */}
      <Modal
        title={blockModalData ? (blockModalData.isBlocked ? 'Bỏ chặn người dùng' : 'Chặn người dùng') : ''}
        open={blockModalVisible}
        onOk={handleBlockModalOk}
        onCancel={handleBlockModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        okType={blockModalData?.isBlocked ? 'default' : 'primary'}
        confirmLoading={blockModalData ? blockingUsers.has(blockModalData.userId) : false}
        okButtonProps={{ 
          style: { 
            backgroundColor: blockModalData?.isBlocked ? '#52c41a' : '#8b5cf6', 
            borderColor: blockModalData?.isBlocked ? '#52c41a' : '#8b5cf6' 
          } 
        }}
      >
        {blockModalData && (
          <p>{blockModalData.content}</p>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
