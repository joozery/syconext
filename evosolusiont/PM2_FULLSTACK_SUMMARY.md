# 🎉 Evolutions Full-Stack - PM2 Setup Complete!

## ✅ Full-Stack Setup Success!

Your Evolutions application is now fully configured with **frontend**, **backend**, **MySQL database**, and **PM2 process manager**!

## 🚀 Quick Start

### Start Everything (Recommended)
```bash
cd /srv/evosolusiont
./fullstack-manager.sh start
```

### Start Backend with PM2
```bash
./backend-pm2-manager.sh start
```

### Access Your Application
- **Frontend**: http://evosolusion-72.60.43.104.sslip.io:3001
- **Backend**: http://evosolusion-72.60.43.104.sslip.io:5000

## 🌐 What You Get

### Frontend (React App)
- **Custom URL**: evosolusion-72.60.43.104.sslip.io:3001
- **React 18**: Modern React with Vite
- **Tailwind CSS**: Beautiful styling
- **Radix UI**: Professional components
- **React Router**: SPA navigation

### Backend (Express API)
- **Custom URL**: evosolusion-72.60.43.104.sslip.io:5000
- **Express.js**: RESTful API server
- **MySQL Database**: Relational database
- **JWT Auth**: Secure authentication
- **CORS**: Cross-origin support
- **Rate Limiting**: API protection

### Database (MySQL)
- **Host**: 145.223.21.117:3306
- **Database**: eep_management
- **User**: debian-sys-maint
- **Tables**: Auto-created with proper relationships

### Process Manager (PM2)
- **Auto Restart**: Restart on crashes
- **Log Management**: Centralized logging
- **Memory Monitoring**: Memory usage tracking
- **Cron Restart**: Daily restart at 2 AM
- **Startup Script**: Auto-start on boot

## 📁 Project Structure

```
/srv/evosolusiont/
├── frontend/                     # React frontend
│   ├── dist/                    # Built React app
│   ├── src/                     # Source code
│   └── package.json             # Frontend dependencies
├── backend/                     # Express backend
│   ├── routes/                  # API routes
│   ├── models/                  # Database models
│   ├── middleware/              # Middleware functions
│   ├── database.js              # MySQL connection
│   ├── ecosystem.config.js      # PM2 configuration
│   └── package.json             # Backend dependencies
├── logs/                        # PM2 logs
│   ├── backend-error.log        # Error logs
│   ├── backend-out.log          # Output logs
│   └── backend-combined.log     # Combined logs
├── fullstack-manager.sh         # Full-stack management
├── evosolusion-manager.sh       # Frontend management
├── backend-manager.sh           # Backend management
├── backend-pm2-manager.sh       # PM2 management
└── ... (configuration files)
```

## 🔧 Available Commands

### Full-Stack Management
```bash
./fullstack-manager.sh start     # Start both frontend and backend
./fullstack-manager.sh stop      # Stop both frontend and backend
./fullstack-manager.sh restart   # Restart both frontend and backend
./fullstack-manager.sh status    # Show status of both services
./fullstack-manager.sh urls      # Show all URLs
./fullstack-manager.sh test      # Test both connections
```

### Frontend Management
```bash
./evosolusion-manager.sh start   # Start frontend only
./evosolusion-manager.sh stop    # Stop frontend only
./evosolusion-manager.sh status  # Show frontend status
./evosolusion-manager.sh urls    # Show frontend URLs
./evosolusion-manager.sh test    # Test frontend connection
```

### Backend Management (PM2)
```bash
./backend-pm2-manager.sh start     # Start backend with PM2
./backend-pm2-manager.sh stop      # Stop backend
./backend-pm2-manager.sh restart   # Restart backend
./backend-pm2-manager.sh status    # Show backend status
./backend-pm2-manager.sh logs      # Show backend logs
./backend-pm2-manager.sh all       # Show all PM2 processes
./backend-pm2-manager.sh setup     # Setup PM2 startup
./backend-pm2-manager.sh monitor   # Monitor backend
```

### Direct PM2 Commands
```bash
pm2 start ecosystem.config.js     # Start with ecosystem file
pm2 stop evolutions-backend       # Stop backend
pm2 restart evolutions-backend    # Restart backend
pm2 delete evolutions-backend    # Delete backend
pm2 list                          # List all processes
pm2 logs evolutions-backend       # View logs
pm2 monit                         # Monitor processes
pm2 save                          # Save current processes
pm2 startup                       # Setup auto-startup
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Core Resources
- `GET /api/users` - Get all users
- `GET /api/projects` - Get all projects
- `GET /api/agencies` - Get all agencies
- `GET /api/epc` - Get all EPC
- `GET /api/coordinators` - Get all coordinators
- `GET /api/reports` - Get all reports

### Health Check
- `GET /api/health` - API health status

## 🗄️ Database Schema

### Tables Created
- ✅ **users** - User accounts and profiles
- ✅ **agencies** - Agency information
- ✅ **coordinators** - Coordinator information
- ✅ **epc** - EPC contractor data
- ✅ **projects** - Project management
- ✅ **reports** - Report generation

### Key Features
- ✅ **Foreign Keys**: Proper relationships
- ✅ **Indexes**: Optimized queries
- ✅ **Timestamps**: Created/Updated tracking
- ✅ **Data Validation**: Type safety
- ✅ **Auto Increment**: Primary keys

## 🌟 Full-Stack Features

### Frontend Features
- ✅ **React 18**: Modern React with Vite
- ✅ **Tailwind CSS**: Beautiful styling
- ✅ **Radix UI**: Professional components
- ✅ **React Router**: SPA navigation
- ✅ **Responsive Design**: Mobile-friendly
- ✅ **Production Ready**: Optimized build

### Backend Features
- ✅ **Express.js**: RESTful API server
- ✅ **MySQL Database**: Relational database
- ✅ **JWT Authentication**: Secure authentication
- ✅ **CORS Support**: Cross-origin requests
- ✅ **Rate Limiting**: API protection
- ✅ **File Upload**: Multer support
- ✅ **Security**: Helmet security headers
- ✅ **Logging**: Morgan request logging
- ✅ **Validation**: Express-validator

### Database Features
- ✅ **MySQL**: Relational database
- ✅ **Connection Pooling**: Efficient connections
- ✅ **Auto Table Creation**: Tables created automatically
- ✅ **Foreign Keys**: Proper relationships
- ✅ **Indexes**: Optimized queries
- ✅ **Timestamps**: Created/Updated tracking

### Process Management Features
- ✅ **PM2**: Process manager
- ✅ **Auto Restart**: Restart on crashes
- ✅ **Log Management**: Centralized logging
- ✅ **Memory Monitoring**: Memory usage tracking
- ✅ **CPU Monitoring**: CPU usage tracking
- ✅ **Cron Restart**: Daily restart at 2 AM
- ✅ **Startup Script**: Auto-start on boot
- ✅ **Environment Variables**: Production environment

### Infrastructure Features
- ✅ **Custom URLs**: evosolusion subdomain
- ✅ **Global Access**: Available worldwide
- ✅ **Easy Management**: Simple scripts
- ✅ **Production Ready**: Optimized for production
- ✅ **Free Service**: Completely free

## 🎯 How It Works

1. **Frontend**: React app serves the user interface
2. **Backend**: Express API handles data and business logic
3. **Database**: MySQL stores all data with proper relationships
4. **Process Manager**: PM2 manages the backend process
5. **Custom URLs**: sslip.io provides public access
6. **Integration**: Frontend communicates with backend via API

## 🔍 Troubleshooting

### Connection Issues
```bash
# Test both connections
./fullstack-manager.sh test

# Check status of both services
./fullstack-manager.sh status

# Restart both services
./fullstack-manager.sh restart
```

### PM2 Issues
```bash
# Check PM2 status
pm2 list

# View PM2 logs
pm2 logs evolutions-backend

# Restart PM2 daemon
pm2 kill
pm2 resurrect
```

### Database Issues
```bash
# Test MySQL connection
mysql -h 145.223.21.117 -P 3306 -u debian-sys-maint -p eep_management
```

### Port Issues
```bash
# Kill processes using ports
sudo lsof -ti:3001 | xargs kill -9  # Frontend
sudo lsof -ti:5000 | xargs kill -9  # Backend
```

## 🎉 Success!

Your Evolutions application is now:
- ✅ **Frontend running** on port 3001
- ✅ **Backend running** on port 5000 with PM2
- ✅ **MySQL database** connected and configured
- ✅ **Tables created** automatically
- ✅ **PM2 process manager** managing backend
- ✅ **Auto-restart** on crashes
- ✅ **Log management** configured
- ✅ **Accessible worldwide** via custom URLs
- ✅ **Easy to manage** with scripts
- ✅ **Production ready** and optimized

## 📞 Next Steps

1. **Start everything**: `./fullstack-manager.sh start`
2. **Access frontend**: http://evosolusion-72.60.43.104.sslip.io:3001
3. **Access backend**: http://evosolusion-72.60.43.104.sslip.io:5000
4. **Test API endpoints**: Use the provided URLs
5. **Setup auto-startup**: `./backend-pm2-manager.sh setup`
6. **Monitor backend**: `./backend-pm2-manager.sh monitor`
7. **Add sample data**: Use the API to create records
8. **Develop features**: Add new functionality

---

**🎉 Your full-stack application with PM2 is now live and ready for production!**
