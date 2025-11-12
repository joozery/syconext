# EVOLUTION ENERGY TECH - API Endpoints

**Base URL:** `https://api.devwooyou.space`

## Authentication APIs

### POST `/api/auth/register`
ลงทะเบียนผู้ใช้ใหม่
- Body: `{ email, password, firstName, lastName, phone, role }`
- Response: `{ success, message, data: { token, user } }`

### POST `/api/auth/login`
เข้าสู่ระบบ
- Body: `{ email, password }`
- Response: `{ success, message, data: { token, user } }`
- **Credentials:**
  - Email: `admin@eep.com`
  - Password: `admin123`

### GET `/api/auth/me`
ดึงข้อมูลผู้ใช้ปัจจุบัน
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: user }`

### POST `/api/auth/logout`
ออกจากระบบ
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message }`

---

## User Management APIs

### GET `/api/users`
ดึงรายการผู้ใช้ทั้งหมด (Admin only)
- Headers: `Authorization: Bearer {token}`
- Query: `page, limit, search, role, status`
- Response: `{ success, data: users[], pagination }`

### GET `/api/users/:id`
ดึงข้อมูลผู้ใช้ตาม ID
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: user }`

### POST `/api/users`
สร้างผู้ใช้ใหม่ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: `{ email, password, firstName, lastName, phone, role }`
- Response: `{ success, message, data: { id } }`

### PUT `/api/users/:id`
อัปเดตข้อมูลผู้ใช้ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: `{ firstName, lastName, phone, role, password }`
- Response: `{ success, message }`

### DELETE `/api/users/:id`
ลบผู้ใช้ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message }`

---

## EPC Company APIs

### GET `/api/epc`
ดึงรายการบริษัท EPC ทั้งหมด
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: companies[] }`

### GET `/api/epc/list`
ดึงรายการบริษัท EPC (alias)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: companies[] }`

### GET `/api/epc/:id`
ดึงข้อมูลบริษัท EPC ตาม ID
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: company }`

### POST `/api/epc/register`
ลงทะเบียนบริษัท EPC ใหม่ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: FormData with fields and `certificate` file
- Response: `{ success, message, data: { id, companyName } }`

---

## Government Agency APIs

### GET `/api/agencies`
ดึงรายการหน่วยงานภาครัฐทั้งหมด
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: agencies[] }`

### GET `/api/agencies/:id`
ดึงข้อมูลหน่วยงานตาม ID
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: agency }`

### POST `/api/agencies/register`
ลงทะเบียนหน่วยงานภาครัฐใหม่ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: `{ agencyName, agencyType, ministry, department, address, province, district, subdistrict, postalCode, phone, email, contactPerson, contactPosition }`
- Response: `{ success, message, data: { id, agencyName } }`

### PUT `/api/agencies/:id`
อัปเดตข้อมูลหน่วยงาน (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: agency fields
- Response: `{ success, message }`

### DELETE `/api/agencies/:id`
ลบหน่วยงาน (Admin only)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message }`

---

## Coordinator (Sale) APIs

### GET `/api/coordinators`
ดึงรายการผู้ประสานงานทั้งหมด
- Headers: `Authorization: Bearer {token}`
- Query: `page, limit, status, search`
- Response: `{ success, data: { coordinators[], pagination } }`

### GET `/api/coordinators/:id`
ดึงข้อมูลผู้ประสานงานตาม ID (Admin only)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: coordinator }`

### POST `/api/coordinators`
ลงทะเบียนผู้ประสานงานใหม่
- Body: FormData with fields, `idCard` file, and `bankPassbook` file
- Response: `{ success, message, data: { id, fullName } }`

### PUT `/api/coordinators/:id`
อัปเดตข้อมูลผู้ประสานงาน (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: coordinator fields
- Response: `{ success, message }`

### PUT `/api/coordinators/:id/approve`
อนุมัติผู้ประสานงาน (Admin only)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message }`

### PUT `/api/coordinators/:id/reject`
ปฏิเสธผู้ประสานงาน (Admin only)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message }`

---

## Project Registration APIs

### GET `/api/projects`
ดึงรายการโครงการทั้งหมด
- Headers: `Authorization: Bearer {token}`
- Query: `page, limit, status, search, region`
- Response: `{ success, data: projects[], pagination }`

### GET `/api/projects/:id`
ดึงข้อมูลโครงการตาม ID
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: project }`

### POST `/api/projects/register`
ลงทะเบียนโครงการใหม่ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: `{ projectName, agencyName, agencyId, coordinatorId, address, province, district, subdistrict, postalCode, region, ministry, affiliation, description, status, startDate, endDate, budget }`
- Response: `{ success, message, data: { id, documentNumber } }`

### PUT `/api/projects/:id`
อัปเดตข้อมูลโครงการ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Body: project fields
- Response: `{ success, message }`

### DELETE `/api/projects/:id`
ลบโครงการ (Admin only)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message }`

---

## Document Version APIs

### GET `/api/document-versions/project/:projectId`
ดึงประวัติการแก้ไขเอกสารของโครงการ
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: versions[] }`

### GET `/api/document-versions/project/:projectId/summary`
ดึงสรุปจำนวนการแก้ไขเอกสาร
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: { versionCount, hasReachedLimit } }`

### POST `/api/document-versions/project/:projectId`
สร้างเวอร์ชันเอกสารใหม่ (Admin only, สูงสุด 3 เวอร์ชัน)
- Headers: `Authorization: Bearer {token}`
- Body: `{ editedData, editReason }`
- Response: `{ success, message, data: { id, versionNumber, documentNumber } }`

### GET `/api/document-versions/:versionId`
ดึงข้อมูลเวอร์ชันเอกสารตาม ID
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, data: version }`

---

## Address APIs (Thai Province Data)

### GET `/api/address/provinces`
ดึงรายการจังหวัดทั้งหมด
- Response: `{ success, data: provinces[] }`

### GET `/api/address/amphures/:provinceId`
ดึงรายการอำเภอ/เขตตามจังหวัด
- Response: `{ success, data: amphures[] }`

### GET `/api/address/tambons/:amphureId`
ดึงรายการตำบล/แขวงตามอำเภอ
- Response: `{ success, data: tambons[] }`

---

## Health Check

### GET `/api/health`
ตรวจสอบสถานะ API
- Response: `{ status: "OK", message, timestamp, environment }`

---

## Notes

1. **Authentication:** ส่ง JWT token ใน Header: `Authorization: Bearer {token}`
2. **File Uploads:** ใช้ `Content-Type: multipart/form-data`
3. **Pagination:** ส่ง `page` และ `limit` ใน query string
4. **Search:** ส่ง `search` ใน query string
5. **Rate Limiting:** 100 requests per 15 minutes

---

## Database Info

- **Host:** 145.223.21.117
- **Database:** eep_management
- **Tables:** users, epc_companies, government_agencies, coordinators, project_registrations, document_numbers, document_versions


