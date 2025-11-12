# EVOLUTION ENERGY TECH System - Database Configuration Summary

## 🗄️ Database Setup Complete

### Remote MongoDB Server Configuration
- **Server**: `145.223.21.117:27017`
- **Username**: `debian-sys-maint`
- **Password**: `Str0ngP@ssw0rd!`
- **Database**: `eep_management`

### Configuration Files Updated
1. **config.js** - Updated with remote database connection
2. **server.js** - Added host configuration and database logging
3. **env.example** - Created environment template
4. **test-db.js** - Database connection test script
5. **setup-db.sh** - Complete database setup script

### Available Scripts
```bash
# Test database connection
npm run test-db

# Seed database with initial data
npm run seed

# Complete database setup (test + seed)
npm run setup-db

# Start development server
npm run dev

# Start production server
npm start
```

### Quick Start Commands
```bash
# 1. Install dependencies
npm install

# 2. Test database connection
npm run test-db

# 3. Setup database (test + seed)
npm run setup-db

# 4. Start server
npm run dev
```

### Default Users (After Seeding)
- **Super Admin**: `admin@eep.com` / `admin123`
- **Admin Users**: `adminA@eep.com`, `adminB@eep.com`, `adminC@eep.com` / `admin123`
- **Coordinators**: `nawarat@eep.com`, `chanin@eep.com`, `thitaree@eep.com` / `coordinator123`
- **Project Managers**: `pmA@eep.com`, `pmB@eep.com` / `pm123`

### Server Configuration
- **Port**: 5000
- **Host**: 0.0.0.0 (accessible from all interfaces)
- **Frontend URL**: http://localhost:3002
- **JWT Secret**: eep-management-system-super-secret-jwt-key-2024

### API Endpoints
- **Base URL**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Authentication**: http://localhost:5000/api/auth/login

### Security Features
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for frontend at localhost:3002
- **JWT Authentication**: Secure token-based auth
- **File Upload**: PDF only, max 20MB
- **Input Validation**: Comprehensive validation

### File Structure
```
backendevo/
├── config.js              # Database configuration
├── server.js              # Main server file
├── test-db.js             # Database connection test
├── seed.js                # Database seeding
├── setup-db.sh            # Complete setup script
├── env.example            # Environment template
├── models/                # Database models
├── routes/                # API routes
├── middleware/            # Custom middleware
└── uploads/               # File uploads
```

### Troubleshooting
1. **Database Connection Failed**
   - Check if MongoDB is running on remote server
   - Verify network connectivity
   - Confirm credentials are correct

2. **Port Already in Use**
   - Change PORT in config.js
   - Kill existing process: `lsof -ti:5000 | xargs kill`

3. **CORS Issues**
   - Update FRONTEND_URL in config.js
   - Check frontend is running on correct port

### Next Steps
1. Run `npm run setup-db` to initialize database
2. Start server with `npm run dev`
3. Test API endpoints
4. Connect frontend to backend API

---
**EVOLUTION ENERGY TECH System Backend** - Ready for deployment! 🚀
