# EVOLUTION ENERGY TECH System - Backend API

Backend API สำหรับระบบบริหารจัดการ EEP (Energy Efficiency Program) ที่ใช้ Node.js, Express.js และ MongoDB

## 🚀 Features

- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **User Management** - Complete user CRUD operations with profile management
- **EPC Registration** - Energy Performance Contractors registration with file uploads
- **Agency Management** - Government and private agency registration
- **Coordinator Management** - Sales coordinator registration and performance tracking
- **Project Management** - Project lifecycle management
- **Reporting System** - Comprehensive analytics and reporting
- **File Upload** - Secure PDF file handling
- **Data Validation** - Input validation and sanitization
- **Security** - Rate limiting, CORS, Helmet security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backendevo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Database is already configured to use remote MongoDB server
   # Server: 145.223.21.117
   # Username: debian-sys-maint
   # Password: Str0ngP@ssw0rd!
   
   # Optional: Create .env file for custom configuration
   cp env.example .env
   # Edit .env with your custom configuration
   ```

4. **Test Database Connection**
   ```bash
   # Test connection to remote MongoDB server
   node test-db.js
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Or use Startup Script:**
   ```bash
   ./start.sh
   ```

## 🗄️ Database Configuration

The system is configured to use a remote MongoDB server:

- **Server**: `145.223.21.117:27017`
- **Username**: `debian-sys-maint`
- **Password**: `Str0ngP@ssw0rd!`
- **Database**: `eep_management`

### Database Connection Test

Test the database connection:
```bash
node test-db.js
```

Expected output:
```
🔗 Testing database connection...
Database URI: mongodb://***:***@145.223.21.117:27017/eep_management
✅ Database connection successful!
📊 Database name: eep_management
🌐 Host: 145.223.21.117
🔌 Port: 27017
```

## 🔧 Configuration

Edit `config.js` to configure:

- **Server**: Port, environment
- **Database**: MongoDB connection string
- **JWT**: Secret key and expiration
- **File Upload**: Max file size, upload path
- **CORS**: Frontend URL
- **Rate Limiting**: Request limits

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/status` - Update user status (Admin only)
- `PUT /api/users/:id/role` - Update user role (Super Admin only)
- `DELETE /api/users/:id` - Delete user (Super Admin only)
- `GET /api/users/stats/overview` - Get user statistics

### EPC Registration
- `POST /api/epc` - Create EPC registration
- `GET /api/epc` - Get all EPCs (Admin only)
- `GET /api/epc/:id` - Get EPC by ID
- `PUT /api/epc/:id/approve` - Approve EPC (Admin only)
- `PUT /api/epc/:id/reject` - Reject EPC (Admin only)
- `DELETE /api/epc/:id` - Delete EPC (Admin only)

### Agency Management
- `POST /api/agencies` - Create agency registration
- `GET /api/agencies` - Get all agencies
- `GET /api/agencies/:id` - Get agency by ID
- `PUT /api/agencies/:id/approve` - Approve agency (Admin only)
- `PUT /api/agencies/:id/reject` - Reject agency (Admin only)
- `GET /api/agencies/stats/overview` - Get agency statistics

### Coordinator Management
- `POST /api/coordinators` - Create coordinator registration
- `GET /api/coordinators` - Get all coordinators
- `GET /api/coordinators/:id` - Get coordinator by ID
- `PUT /api/coordinators/:id/approve` - Approve coordinator (Admin only)
- `PUT /api/coordinators/:id/reject` - Reject coordinator (Admin only)
- `GET /api/coordinators/stats/overview` - Get coordinator statistics

### Project Management
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats/overview` - Get project statistics

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/registrations` - Get registration statistics
- `GET /api/reports/performance` - Get performance metrics
- `GET /api/reports/export` - Export data

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **super-admin**: Full system access
- **admin**: Administrative access
- **coordinator**: Coordinator management
- **project-manager**: Project management

## 📁 File Upload

Supported file types:
- PDF files only
- Maximum size: 20MB
- Files are stored in `/uploads` directory

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive input validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## 📊 Database Schema

### Users
- Personal information (name, email, phone)
- Role-based access control
- Account status management
- Last login tracking

### EPC
- Company information
- Address details (province, district, subdistrict, postal code)
- File uploads (NDA, certificates, contracts)
- Approval workflow

### Agency
- Agency information
- Ministry and affiliation
- Coordinator assignment
- Type classification (EPC, Government, Private)

### Coordinator
- Personal information
- Banking details
- Performance metrics
- File uploads (ID card, bank book, contract)

### Project
- Project details
- Status tracking
- Assignment management
- Progress monitoring

## 🚨 Error Handling

API returns consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (development only)"
}
```

## 📈 Performance

- **Database Indexing**: Optimized queries with proper indexing
- **Pagination**: Efficient data pagination
- **Caching**: Ready for Redis integration
- **Compression**: Response compression support

## 🔄 Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Code Structure
```
backendevo/
├── config.js          # Configuration
├── server.js          # Main server file
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── controllers/       # Route controllers
├── uploads/           # File uploads
└── README.md         # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

**EVOLUTION ENERGY TECH System Backend API** - Built with ❤️ for energy efficiency management
