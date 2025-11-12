# 🌐 Evolutions Frontend - Free Subdomain Services

## ✅ Tunnel Setup Complete!

Your Evolutions frontend is now accessible via **Cloudflare Tunnel** - a free subdomain service!

## 🚀 Quick Start

### Start Tunnel
```bash
cd /srv/evosolusiont
./tunnel-manager.sh start
```

### Stop Tunnel
```bash
./tunnel-manager.sh stop
```

### Check Status
```bash
./tunnel-manager.sh status
```

## 🌐 Access Your Frontend

### Local Access
- **Localhost**: http://localhost:3001
- **IP Address**: http://0.0.0.0:3001

### Public Access (via Tunnel)
- **Cloudflare Tunnel**: Check terminal output for the tunnel URL
- **Format**: `https://random-subdomain.trycloudflare.com`

## 🔧 Tunnel Management

### Available Commands
```bash
./tunnel-manager.sh start    # Start tunnel
./tunnel-manager.sh stop     # Stop tunnel
./tunnel-manager.sh restart  # Restart tunnel
./tunnel-manager.sh status   # Show status
```

### Manual Tunnel Control
```bash
# Start tunnel manually
cloudflared tunnel --url http://localhost:3001

# Stop tunnel
pkill cloudflared
```

## 📋 Prerequisites

### 1. Frontend Server Running
```bash
cd /srv/evosolusiont
node server.js
```

### 2. Cloudflared Installed
```bash
# Already installed ✅
cloudflared --version
```

## 🔍 Troubleshooting

### Tunnel Not Working
```bash
# Check if frontend server is running
curl http://localhost:3001

# Check tunnel status
./tunnel-manager.sh status

# Restart tunnel
./tunnel-manager.sh restart
```

### Frontend Server Not Running
```bash
# Start frontend server
cd /srv/evosolusiont
node server.js
```

### Port Already in Use
```bash
# Kill process using port 3001
sudo lsof -ti:3001 | xargs kill -9
```

## 🌟 Features

- ✅ **Free Subdomain**: No domain registration needed
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Global CDN**: Fast access worldwide
- ✅ **No Configuration**: Works out of the box
- ✅ **Secure**: Encrypted tunnel
- ✅ **Reliable**: Cloudflare infrastructure

## 📱 How It Works

1. **Frontend Server**: Runs on `localhost:3001`
2. **Cloudflare Tunnel**: Creates secure connection to Cloudflare
3. **Public URL**: Cloudflare provides public HTTPS URL
4. **Global Access**: Anyone can access via the public URL

## 🎯 Next Steps

1. **Start the tunnel**: `./tunnel-manager.sh start`
2. **Get the public URL**: Check terminal output
3. **Share the URL**: Anyone can access your frontend
4. **Test access**: Open the URL in any browser

## 📞 Support

- **Tunnel Issues**: Check Cloudflare documentation
- **Frontend Issues**: Check server logs
- **Script Issues**: Check `tunnel-manager.sh` permissions

---

**🎉 Your frontend is now accessible worldwide via a free subdomain!**
