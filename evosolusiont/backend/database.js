const mysql = require('mysql2/promise');
const config = require('./config');

let pool = null;

// Create MySQL connection pool
const createPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      port: config.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    
    console.log('📊 MySQL connection pool created');
  }
  return pool;
};

// Get pool instance
const getPool = () => {
  if (!pool) {
    return createPool();
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Initialize database (create tables if not exist)
const initializeDatabase = async () => {
  const pool = getPool();
  
  try {
    // Check if tables exist
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('users', 'epc_companies', 'government_agencies', 'coordinators', 'project_registrations')
    `, [config.DB_NAME]);
    
    if (tables.length === 5) {
      console.log('✅ All required tables exist');
      return true;
    }
    
    console.log('⚠️ Some tables are missing. Please run database migrations.');
    return false;
  } catch (error) {
    console.error('❌ Error checking database tables:', error.message);
    throw error;
  }
};

// Close pool
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('📊 MySQL connection pool closed');
  }
};

module.exports = {
  getPool,
  createPool,
  testConnection,
  initializeDatabase,
  closePool
};


