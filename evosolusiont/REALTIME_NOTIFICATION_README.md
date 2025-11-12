# Real-time Notification System 🔔

## ภาพรวม
ระบบแจ้งเตือนแบบ Real-time สำหรับ Admin โดยใช้ Socket.io เพื่อแจ้งเตือนเมื่อมีกิจกรรมสำคัญในระบบ

## ฟีเจอร์หลัก

### 🎯 การแจ้งเตือนที่รองรับ
1. **การเข้าสู่ระบบ** - แจ้งเตือนเมื่อมีผู้ใช้เข้าสู่ระบบ
2. **ผู้ใช้ใหม่** - แจ้งเตือนเมื่อมีผู้ใช้ลงทะเบียนใหม่
3. **บริษัท EPC ใหม่** - แจ้งเตือนเมื่อมีบริษัท EPC ลงทะเบียน
4. **หน่วยงานใหม่** - แจ้งเตือนเมื่อมีหน่วยงานรัฐลงทะเบียน
5. **ผู้ประสานงานใหม่** - แจ้งเตือนเมื่อมี Sale/Coordinator ลงทะเบียน
6. **โครงการใหม่** - แจ้งเตือนเมื่อมีโครงการใหม่

### ✨ คุณสมบัติ
- ✅ Real-time notifications (ไม่ต้อง refresh หน้า)
- ✅ แจ้งเตือนเฉพาะ Admin role เท่านั้น
- ✅ แสดงจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
- ✅ Toast notification popup
- ✅ Notification dropdown ที่สวยงาม
- ✅ รองรับการทำ mark as read
- ✅ ลบการแจ้งเตือนแต่ละรายการ
- ✅ ลบการแจ้งเตือนทั้งหมด
- ✅ อ่านทั้งหมดพร้อมกัน
- ✅ แสดงสถานะการเชื่อมต่อ Socket

## โครงสร้างไฟล์

### Backend
```
backend/
├── socket.js                           # Socket.IO server และ notification helpers
├── server.js                           # Socket initialization
└── routes/
    ├── auth-mysql.js                   # Login/Register notifications
    ├── epc.js                          # EPC registration notifications
    ├── agencies.js                     # Agency registration notifications
    └── coordinators-mysql.js           # Coordinator registration notifications
```

### Frontend
```
src/
├── contexts/
│   └── NotificationContext.jsx         # Notification state management
├── components/
│   ├── NotificationBell.jsx            # Notification UI component
│   └── AdminDashboard.jsx              # Dashboard with notification bell
└── App.jsx                             # NotificationProvider wrapper
```

## การติดตั้ง

### Dependencies ที่ติดตั้งแล้ว

**Backend:**
```bash
cd backend
npm install socket.io
```

**Frontend:**
```bash
cd /srv/evosolusiont
npm install socket.io-client
```

## การใช้งาน

### 1. สำหรับ Admin
เมื่อ Admin เข้าสู่ระบบ:
1. Socket.io จะเชื่อมต่ออัตโนมัติ
2. จะเห็นไอคอนระฆังด้านขวาบนของ navbar
3. จะมี Badge แสดงจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
4. คลิกที่ไอคอนระฆังเพื่อดูรายการแจ้งเตือนทั้งหมด

### 2. การทำงานของระบบ

#### เมื่อมีการเข้าสู่ระบบ:
```javascript
// ส่งการแจ้งเตือนไปยัง Admin ทุกคน
const notification = createNotification(
  NotificationTypes.USER_LOGIN,
  `${user.firstName} ${user.lastName} เข้าสู่ระบบ (${user.role})`,
  { userId: user.id, email: user.email, role: user.role }
);
sendNotificationToAdmins(notification);
```

#### เมื่อมีการลงทะเบียน EPC:
```javascript
const notification = createNotification(
  NotificationTypes.EPC_REGISTER,
  `บริษัท EPC ใหม่ลงทะเบียน: ${epcName}`,
  { epcId: result.insertId, epcName, taxId }
);
sendNotificationToAdmins(notification);
```

## API Reference

### Backend - Socket Events

#### Server-side Events
```javascript
// ส่งการแจ้งเตือนไปยัง Admin room
sendNotificationToAdmins(notification)

// สร้าง notification object
createNotification(type, message, data)
```

#### Client-side Events
```javascript
// รับการแจ้งเตือน
socket.on('notification', (notification) => {
  // Handle notification
})

// ส่งสัญญาณว่าอ่านแล้ว
socket.emit('notification:read', notificationId)
```

### Frontend - useNotifications Hook

```javascript
const {
  notifications,      // Array of notifications
  unreadCount,        // Number of unread notifications
  isConnected,        // Socket connection status
  markAsRead,         // Mark single notification as read
  markAllAsRead,      // Mark all as read
  clearAll,           // Clear all notifications
  deleteNotification  // Delete specific notification
} = useNotifications();
```

## Notification Types

```javascript
const NotificationTypes = {
  USER_LOGIN: 'user_login',
  USER_REGISTER: 'user_register',
  EPC_REGISTER: 'epc_register',
  AGENCY_REGISTER: 'agency_register',
  COORDINATOR_REGISTER: 'coordinator_register',
  PROJECT_REGISTER: 'project_register',
  APPROVAL_REQUEST: 'approval_request'
};
```

## การปรับแต่ง

### เพิ่ม Notification Type ใหม่

1. **เพิ่มใน Backend (socket.js):**
```javascript
const NotificationTypes = {
  // ... existing types
  YOUR_NEW_TYPE: 'your_new_type'
};
```

2. **เพิ่มไอคอนใน Frontend (NotificationBell.jsx):**
```javascript
const getNotificationIcon = (type) => {
  const icons = {
    // ... existing icons
    your_new_type: '🆕'
  };
  return icons[type] || '🔔';
};
```

3. **ใช้งานใน Route:**
```javascript
const notification = createNotification(
  NotificationTypes.YOUR_NEW_TYPE,
  'Your notification message',
  { /* your data */ }
);
sendNotificationToAdmins(notification);
```

## Security

- ✅ Socket connections ต้องมี JWT token
- ✅ Admin role verification
- ✅ แจ้งเตือนเฉพาะ Admin room เท่านั้น
- ✅ Token verification ที่ socket middleware

## Troubleshooting

### ปัญหา: Socket ไม่เชื่อมต่อ
**วิธีแก้:**
1. ตรวจสอบว่า backend server รันอยู่
2. ตรวจสอบว่ามี JWT token ใน localStorage
3. ตรวจสอบ CORS settings
4. ดู console log สำหรับ error messages

### ปัญหา: ไม่ได้รับ notification
**วิธีแก้:**
1. ตรวจสอบว่า user role เป็น 'admin'
2. ตรวจสอบว่า socket connected (จุดสีเขียว)
3. ดู network tab ใน browser devtools
4. ตรวจสอบ backend logs

### ปัญหา: Notification ซ้ำ
**วิธีแก้:**
1. ตรวจสอบว่าไม่มี multiple socket connections
2. Clear localStorage และ login ใหม่

## Environment Variables

**Backend:**
- `JWT_SECRET` - JWT secret key สำหรับ authentication
- `PORT` - Backend server port (default: 5000)

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL

## Performance

- ✅ Efficient connection management
- ✅ Auto-reconnection on disconnect
- ✅ Minimal payload size
- ✅ Room-based broadcasting (แจ้งเฉพาะ Admin)

## Future Enhancements

- 🔲 เก็บ notifications ใน database
- 🔲 Notification history page
- 🔲 Push notifications
- 🔲 Email notifications
- 🔲 Notification preferences/settings
- 🔲 Sound alerts
- 🔲 Different notification priorities

## การทดสอบ

### ทดสอบระบบ:
1. เปิด 2 browser tabs
2. Login เป็น Admin ใน tab 1
3. Login/Register ใหม่ใน tab 2
4. Tab 1 (Admin) จะได้รับการแจ้งเตือนทันที

### ทดสอบ notification types:
- Login ด้วย user ใหม่
- ลงทะเบียน EPC ใหม่
- ลงทะเบียนหน่วยงานใหม่
- ลงทะเบียน Sale/Coordinator ใหม่

## Support

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ console logs (F12)
2. ตรวจสอบ network tab
3. ตรวจสอบ backend logs
4. ดูตัวอย่างใน code comments

---

**Created:** November 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready


