# API Documentation - Admin Management System

## Tổng quan

Hệ thống Admin Management cung cấp các API để quản lý người dùng, bao gồm xem danh sách, chi tiết, chặn/bỏ chặn, thay đổi vai trò và thống kê người dùng.

**Base URL:** `http://localhost:8080`  
**API Prefix:** `/api/admin`  
**Authentication:** Bearer Token (JWT)  
**Required Role:** `ROLE_ADMIN`

---

## Authentication

### Login để lấy JWT Token

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "admin_password"
}
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Đăng nhập thành công"
    },
    "data": "eyJhbGciOiJSUzI1NiJ9.eyJpZCI6InVzZXJfaWQiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.token_signature"
}
```

**Headers cho tất cả Admin API:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 1. User Management APIs

### 1.1. Lấy danh sách người dùng

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 0 | Số trang (bắt đầu từ 0) |
| `size` | integer | No | 10 | Số lượng bản ghi trên mỗi trang |
| `search` | string | No | - | Từ khóa tìm kiếm theo tên hiển thị |
| `status` | string | No | - | Lọc theo trạng thái ("active", "inactive") |

**Request Example:**
```
GET /api/admin/users?page=0&size=10&search=john&status=active
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Lấy danh sách người dùng thành công"
    },
    "data": {
        "content": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "john.doe@example.com",
                "displayName": "John Doe",
                "phoneNumber": "0123456789",
                "birthday": "1990-01-15",
                "avatarUrl": "/uploads/avatar/john_avatar.jpg",
                "status": "active",
                "role": "ROLE_USER",
                "isBlocked": false,
                "lastLoginAt": "2024-01-15T10:30:00",
                "loginCount": 25,
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-15T10:30:00"
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "totalElements": 150,
            "totalPages": 15,
            "first": true,
            "last": false,
            "numberOfElements": 10
        }
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "01",
        "success": false,
        "displayMessage": "Lỗi khi lấy danh sách người dùng: [error_message]"
    }
}
```

### 1.2. Lấy thông tin chi tiết người dùng

**Endpoint:** `GET /api/admin/users/{userId}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | UUID của người dùng |

**Request Example:**
```
GET /api/admin/users/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Lấy thông tin người dùng thành công"
    },
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "phoneNumber": "0123456789",
        "birthday": "1990-01-15",
        "avatarUrl": "/uploads/avatar/john_avatar.jpg",
        "status": "active",
        "role": "ROLE_USER",
        "isBlocked": false,
        "lastLoginAt": "2024-01-15T10:30:00",
        "loginCount": 25,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T10:30:00"
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "02",
        "success": false,
        "displayMessage": "Không tìm thấy người dùng: User not found"
    }
}
```

### 1.3. Chặn/Bỏ chặn người dùng

**Endpoint:** `PUT /api/admin/users/{userId}/block`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | UUID của người dùng |

**Request Body:**
```json
{
    "isBlocked": true,
    "reason": "Vi phạm quy tắc cộng đồng - Spam tin nhắn"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `isBlocked` | boolean | Yes | `true` để chặn, `false` để bỏ chặn |
| `reason` | string | No | Lý do chặn/bỏ chặn |

**Request Example:**
```
PUT /api/admin/users/550e8400-e29b-41d4-a716-446655440000/block
Content-Type: application/json

{
    "isBlocked": true,
    "reason": "Vi phạm quy tắc cộng đồng"
}
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Đã chặn người dùng thành công"
    },
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "isBlocked": true,
        "lastLoginAt": "2024-01-15T10:30:00",
        "loginCount": 25,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T11:00:00"
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "04",
        "success": false,
        "displayMessage": "Không tìm thấy người dùng: User not found"
    }
}
```

### 1.4. Thay đổi vai trò người dùng

**Endpoint:** `PUT /api/admin/users/{userId}/role`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | UUID của người dùng |

**Request Body:**
```json
{
    "role": "ROLE_ADMIN"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | Yes | Vai trò mới: `"ROLE_USER"` hoặc `"ROLE_ADMIN"` |

**Role Values:**
- `ROLE_USER`: Người dùng thường
- `ROLE_ADMIN`: Quản trị viên

**Request Example:**
```
PUT /api/admin/users/550e8400-e29b-41d4-a716-446655440000/role
Content-Type: application/json

{
    "role": "ROLE_ADMIN"
}
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Đã thay đổi vai trò người dùng thành công"
    },
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "role": "ROLE_ADMIN",
        "isBlocked": false,
        "lastLoginAt": "2024-01-15T10:30:00",
        "loginCount": 25,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T11:30:00"
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "06",
        "success": false,
        "displayMessage": "Không tìm thấy người dùng: User not found"
    }
}
```

---

## 2. Statistics API

### 2.1. Lấy thống kê người dùng

**Endpoint:** `GET /api/admin/statistics/users`

**Request Example:**
```
GET /api/admin/statistics/users
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Lấy thống kê người dùng thành công"
    },
    "data": {
        "totalUsers": 150,
        "activeUsers": 120,
        "blockedUsers": 5,
        "newUsersToday": 3,
        "adminUsers": 2
    }
}
```

**Statistics Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `totalUsers` | integer | Tổng số người dùng trong hệ thống |
| `activeUsers` | integer | Số người dùng đang hoạt động (status = "active" và không bị chặn) |
| `blockedUsers` | integer | Số người dùng bị chặn |
| `newUsersToday` | integer | Số người dùng đăng ký mới hôm nay |
| `adminUsers` | integer | Số quản trị viên |

---

## 3. Data Models

### 3.1. AdminUserResponse

```json
{
    "id": "string (UUID)",
    "email": "string",
    "displayName": "string",
    "phoneNumber": "string",
    "birthday": "string (YYYY-MM-DD)",
    "avatarUrl": "string (URL)",
    "status": "string (active|inactive)",
    "role": "string (ROLE_USER|ROLE_ADMIN)",
    "isBlocked": "boolean",
    "lastLoginAt": "string (ISO 8601 datetime)",
    "loginCount": "integer",
    "createdAt": "string (ISO 8601 datetime)",
    "updatedAt": "string (ISO 8601 datetime)"
}
```

### 3.2. UserStatisticsResponse

```json
{
    "totalUsers": "integer",
    "activeUsers": "integer",
    "blockedUsers": "integer",
    "newUsersToday": "integer",
    "adminUsers": "integer"
}
```

### 3.3. BlockUserRequest

```json
{
    "isBlocked": "boolean",
    "reason": "string (optional)"
}
```

### 3.4. ChangeUserRoleRequest

```json
{
    "role": "string (ROLE_USER|ROLE_ADMIN)"
}
```

---

## 4. Error Codes

| Code | Description |
|------|-------------|
| `00` | Success |
| `01` | Error getting user list |
| `02` | User not found |
| `03` | Error getting user details |
| `04` | User not found (block operation) |
| `05` | Error blocking/unblocking user |
| `06` | User not found (role operation) |
| `07` | Error changing user role |
| `08` | Error getting user statistics |

---

## 5. HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request thành công |
| `400 Bad Request` | Dữ liệu request không hợp lệ |
| `401 Unauthorized` | Token không hợp lệ hoặc thiếu |
| `403 Forbidden` | Không có quyền truy cập (không phải admin) |
| `404 Not Found` | Resource không tồn tại |
| `500 Internal Server Error` | Lỗi server |

---

## 6. Pagination

Tất cả API trả về danh sách đều hỗ trợ pagination với cấu trúc:

```json
{
    "content": [...], // Array of items
    "pageable": {
        "pageNumber": 0,        // Current page (0-based)
        "pageSize": 10,         // Items per page
        "totalElements": 150,   // Total items
        "totalPages": 15,       // Total pages
        "first": true,          // Is first page
        "last": false,          // Is last page
        "numberOfElements": 10  // Items in current page
    }
}
```

---

## 7. Frontend Integration Examples

### 7.1. React/JavaScript Example

```javascript
// API Client
class AdminAPI {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();
        
        if (!data.status.success) {
            throw new Error(data.status.displayMessage);
        }

        return data.data;
    }

    // Get users with pagination and filters
    async getUsers(page = 0, size = 10, search = '', status = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(search && { search }),
            ...(status && { status })
        });

        return this.request(`/api/admin/users?${params}`);
    }

    // Get user details
    async getUserDetails(userId) {
        return this.request(`/api/admin/users/${userId}`);
    }

    // Block/Unblock user
    async blockUser(userId, isBlocked, reason = '') {
        return this.request(`/api/admin/users/${userId}/block`, {
            method: 'PUT',
            body: JSON.stringify({ isBlocked, reason })
        });
    }

    // Change user role
    async changeUserRole(userId, role) {
        return this.request(`/api/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
    }

    // Get user statistics
    async getUserStatistics() {
        return this.request('/api/admin/statistics/users');
    }
}

// Usage
const adminAPI = new AdminAPI('http://localhost:8080', 'your-jwt-token');

// Get users
const users = await adminAPI.getUsers(0, 10, 'john', 'active');

// Block user
await adminAPI.blockUser('user-id', true, 'Violation of community rules');

// Get statistics
const stats = await adminAPI.getUserStatistics();
```

### 7.2. Vue.js Example

```javascript
// adminService.js
import axios from 'axios';

const adminService = {
    async getUsers(page = 0, size = 10, search = '', status = '') {
        const params = { page, size };
        if (search) params.search = search;
        if (status) params.status = status;

        const response = await axios.get('/api/admin/users', { params });
        return response.data.data;
    },

    async getUserDetails(userId) {
        const response = await axios.get(`/api/admin/users/${userId}`);
        return response.data.data;
    },

    async blockUser(userId, isBlocked, reason = '') {
        const response = await axios.put(`/api/admin/users/${userId}/block`, {
            isBlocked,
            reason
        });
        return response.data.data;
    },

    async changeUserRole(userId, role) {
        const response = await axios.put(`/api/admin/users/${userId}/role`, {
            role
        });
        return response.data.data;
    },

    async getUserStatistics() {
        const response = await axios.get('/api/admin/statistics/users');
        return response.data.data;
    }
};

export default adminService;
```

### 7.3. Angular Example

```typescript
// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) {}

    getUsers(page: number = 0, size: number = 10, search?: string, status?: string): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (search) params = params.set('search', search);
        if (status) params = params.set('status', status);

        return this.http.get(`${this.baseUrl}/users`, { params });
    }

    getUserDetails(userId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/${userId}`);
    }

    blockUser(userId: string, isBlocked: boolean, reason?: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/users/${userId}/block`, {
            isBlocked,
            reason
        });
    }

    changeUserRole(userId: string, role: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/users/${userId}/role`, { role });
    }

    getUserStatistics(): Observable<any> {
        return this.http.get(`${this.baseUrl}/statistics/users`);
    }
}
```

---

## 8. Best Practices

### 8.1. Error Handling
- Luôn kiểm tra `data.status.success` trước khi sử dụng `data.data`
- Hiển thị `data.status.displayMessage` cho user khi có lỗi
- Implement retry logic cho network errors

### 8.2. Loading States
- Hiển thị loading spinner khi gọi API
- Disable buttons trong quá trình xử lý
- Implement optimistic updates cho UX tốt hơn

### 8.3. Validation
- Validate input trước khi gửi request
- Kiểm tra role values (`ROLE_USER`, `ROLE_ADMIN`)
- Validate UUID format cho userId

### 8.4. Security
- Luôn gửi JWT token trong header Authorization
- Implement token refresh logic
- Logout khi nhận 401/403 response

---

## 9. Testing Checklist

- [ ] Login với admin account
- [ ] Test tất cả endpoints với valid token
- [ ] Test error cases (invalid token, non-admin user)
- [ ] Test pagination và filtering
- [ ] Test block/unblock functionality
- [ ] Test role change functionality
- [ ] Test statistics API
- [ ] Test error responses
- [ ] Test edge cases (empty lists, invalid IDs)

Tài liệu này cung cấp đầy đủ thông tin để frontend developer có thể tích hợp hoàn hảo mà không cần đọc code backend.