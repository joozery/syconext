#!/bin/bash

# EVOLUTION ENERGY TECH System - Database Setup Script

echo "🗄️  EVOLUTION ENERGY TECH System - Database Setup"
echo "=========================================="

# Database configuration
DB_HOST="145.223.21.117"
DB_PORT="27017"
DB_USER="debian-sys-maint"
DB_PASS="Str0ngP@ssw0rd!"
DB_NAME="eep_management"

echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Username: $DB_USER"
echo "   Database: $DB_NAME"
echo ""

# Test database connection
echo "🔗 Testing database connection..."
node test-db.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database connection successful!"
    echo ""
    echo "🌱 Seeding database with initial data..."
    npm run seed
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Database setup completed successfully!"
        echo ""
        echo "📋 Default Users Created:"
        echo "   Super Admin: admin@eep.com / admin123"
        echo "   Admin Users: adminA@eep.com, adminB@eep.com, adminC@eep.com / admin123"
        echo "   Coordinators: nawarat@eep.com, chanin@eep.com, thitaree@eep.com / coordinator123"
        echo "   Project Managers: pmA@eep.com, pmB@eep.com / pm123"
        echo ""
        echo "🚀 You can now start the server with: npm run dev"
    else
        echo "❌ Database seeding failed!"
        exit 1
    fi
else
    echo "❌ Database connection failed!"
    echo "💡 Please check:"
    echo "   - MongoDB is running on the remote server"
    echo "   - Network connectivity to $DB_HOST:$DB_PORT"
    echo "   - Credentials are correct"
    exit 1
fi
