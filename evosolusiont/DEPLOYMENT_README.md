# Evolutions Frontend Deployment Guide

## Overview
This is a React frontend application deployed without a domain, accessible via IP address and localhost.

## Quick Start

### Option 1: Using the deployment script
```bash
./deploy.sh
```

### Option 2: Manual deployment
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Install server dependencies
npm install express cors

# Start the server
node server.js
```

## Access URLs

- **Localhost**: http://localhost:3001
- **IP Address**: http://0.0.0.0:3001
- **Network Access**: http://[YOUR_SERVER_IP]:3001

## Configuration

### Environment Variables
Edit `env.production` to customize:
- `PORT`: Server port (default: 3001)
- `HOST`: Server host (default: 0.0.0.0)
- `NODE_ENV`: Environment (default: production)

### Server Configuration
The server is configured in `server.js`:
- Serves static files from `dist/` directory
- Handles React Router (SPA routing)
- Enables CORS for all origins
- Runs on all interfaces (0.0.0.0)

## Project Structure

```
evosolusiont/
├── dist/                 # Built React app
├── src/                  # Source code
├── public/               # Static assets
├── server.js             # Express server
├── server-package.json   # Server dependencies
├── env.production        # Environment config
├── deploy.sh             # Deployment script
└── package.json          # Frontend dependencies
```

## Development

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Troubleshooting

### Port already in use
```bash
# Kill process using port 3001
sudo lsof -ti:3001 | xargs kill -9
```

### Permission denied
```bash
# Make deploy script executable
chmod +x deploy.sh
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Features

- ✅ React 18 with Vite
- ✅ Tailwind CSS
- ✅ Radix UI Components
- ✅ React Router
- ✅ Responsive Design
- ✅ Production Ready
- ✅ CORS Enabled
- ✅ SPA Routing Support

## Support

For issues or questions, please check the original repository: https://github.com/joozery/evolutions.git
