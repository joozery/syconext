# EVOLUTION ENERGY TECH System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login user
```json
{
  "username": "admin@eep.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "ผู้ดูแลระบบหลัก",
      "email": "admin@eep.com",
      "role": "super-admin",
      "status": "active"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/register
Register new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08x-xxx-xxxx",
  "role": "coordinator"
}
```

#### GET /auth/me
Get current user (Protected)

#### POST /auth/change-password
Change password (Protected)
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### Users

#### GET /users
Get all users (Admin only)
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role
- `status`: Filter by status
- `search`: Search term

#### GET /users/:id
Get user by ID (Protected)

#### PUT /users/:id
Update user (Protected)

#### PUT /users/:id/status
Update user status (Admin only)
```json
{
  "status": "active"
}
```

#### GET /users/stats/overview
Get user statistics (Admin only)

### EPC Registration

#### POST /epc
Create EPC registration (Protected)
```json
{
  "epcName": "บริษัท ABC Energy จำกัด",
  "epcAddress": "123 ถนนสุขุมวิท",
  "epcContact": "02-123-4567",
  "taxId": "1234567890123",
  "province": "กรุงเทพมหานคร",
  "district": "วัฒนา",
  "subdistrict": "คลองตัน",
  "postalCode": "10110",
  "coordinatorName": "คุณนวรัตน์",
  "coordinatorContact": "08x-xxx-xxxx"
}
```

Files (multipart/form-data):
- `nda`: NDA file (PDF)
- `companyCert`: Company certificate (PDF)
- `employmentContract`: Employment contract (PDF)
- `tndtContract`: TNDT contract (PDF)

#### GET /epc
Get all EPCs (Admin only)

#### GET /epc/:id
Get EPC by ID (Protected)

#### PUT /epc/:id/approve
Approve EPC (Admin only)

#### PUT /epc/:id/reject
Reject EPC (Admin only)
```json
{
  "rejectionReason": "Incomplete documentation"
}
```

### Agency Management

#### POST /agencies
Create agency registration (Protected)
```json
{
  "agencyName": "กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน",
  "agencyCode": "GOV001",
  "ministry": "กระทรวงพลังงาน",
  "affiliation": "กระทรวงพลังงาน",
  "address": "17 ถนนพระราม 4",
  "province": "กรุงเทพมหานคร",
  "district": "สาทร",
  "subdistrict": "ทุ่งมหาเมฆ",
  "contactNumber": "02-345-6789",
  "coordinatorId": "coordinator_id",
  "type": "Government"
}
```

#### GET /agencies
Get all agencies (Protected)

#### GET /agencies/:id
Get agency by ID (Protected)

#### PUT /agencies/:id/approve
Approve agency (Admin only)

#### PUT /agencies/:id/reject
Reject agency (Admin only)

#### GET /agencies/stats/overview
Get agency statistics (Admin only)

### Coordinator Management

#### POST /coordinators
Create coordinator registration (Protected)
```json
{
  "fullName": "คุณนวรัตน์",
  "address": "123 ถนนสุขุมวิท",
  "phone": "08x-xxx-xxxx",
  "bank": "ธนาคารกรุงเทพ",
  "bankAccount": "1234567890",
  "referralId": "REF000001"
}
```

Files (multipart/form-data):
- `idCard`: ID card (PDF)
- `bankBook`: Bank book (PDF)
- `contract`: Contract (PDF)

#### GET /coordinators
Get all coordinators (Protected)

#### GET /coordinators/:id
Get coordinator by ID (Protected)

#### PUT /coordinators/:id/approve
Approve coordinator (Admin only)

#### PUT /coordinators/:id/reject
Reject coordinator (Admin only)

#### GET /coordinators/stats/overview
Get coordinator statistics (Admin only)

### Project Management

#### POST /projects
Create project (Protected)
```json
{
  "projectName": "โครงการพลังงานทดแทน",
  "description": "โครงการติดตั้งระบบพลังงานทดแทน",
  "status": "pending",
  "priority": "high",
  "budget": 1000000,
  "location": {
    "address": "123 ถนนสุขุมวิท",
    "province": "กรุงเทพมหานคร",
    "district": "วัฒนา",
    "subdistrict": "คลองตัน",
    "postalCode": "10110"
  }
}
```

#### GET /projects
Get all projects (Protected)

#### GET /projects/:id
Get project by ID (Protected)

#### PUT /projects/:id
Update project (Protected)

#### DELETE /projects/:id
Delete project (Protected)

#### GET /projects/stats/overview
Get project statistics (Admin only)

### Reports

#### GET /reports/dashboard
Get dashboard statistics (Admin only)

#### GET /reports/registrations
Get registration statistics (Admin only)
Query parameters:
- `period`: Number of days (default: 30)

#### GET /reports/performance
Get performance metrics (Admin only)

#### GET /reports/export
Export data (Admin only)
Query parameters:
- `type`: Data type (epcs, agencies, coordinators, users, projects)
- `format`: Export format (csv, excel)

### Health Check

#### GET /health
API health status
```json
{
  "status": "OK",
  "message": "EVOLUTION ENERGY TECH System API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Rate limit headers included in response

## File Upload

- Maximum file size: 20MB
- Supported formats: PDF only
- Files stored in `/uploads` directory

## Pagination

All list endpoints support pagination:
```
GET /api/users?page=1&limit=10
```

Response includes pagination info:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

## Search

Many endpoints support search:
```
GET /api/users?search=admin
```

## Filtering

Endpoints support various filters:
```
GET /api/users?role=admin&status=active
```

## User Roles

- `super-admin`: Full system access
- `admin`: Administrative access
- `coordinator`: Coordinator management
- `project-manager`: Project management

## Status Values

### EPC/Agency/Coordinator Status
- `pending`: Awaiting approval
- `approved`: Approved and active
- `rejected`: Rejected
- `active`: Currently active
- `inactive`: Deactivated

### Project Status
- `pending`: Awaiting approval
- `approved`: Approved
- `rejected`: Rejected
- `in-progress`: Currently in progress
- `completed`: Completed

### User Status
- `active`: Active user
- `inactive`: Deactivated user

## Development

### Starting the Server
```bash
npm run dev
```

### Seeding Database
```bash
npm run seed
```

### Default Users
After seeding:
- Super Admin: `admin@eep.com` / `admin123`
- Admin Users: `adminA@eep.com`, `adminB@eep.com`, `adminC@eep.com` / `admin123`
- Coordinators: `nawarat@eep.com`, `chanin@eep.com`, `thitaree@eep.com` / `coordinator123`
- Project Managers: `pmA@eep.com`, `pmB@eep.com` / `pm123`
