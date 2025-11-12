module.exports = {
  apps: [{
    name: 'evolutions-backend',
    script: 'server.js',
    cwd: '/srv/evosolusiont/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0',
      DB_HOST: '145.223.21.117',
      DB_PORT: 3306,
      DB_NAME: 'eep_management',
      DB_USER: 'debian-sys-maint',
      DB_PASSWORD: 'Str0ngP@ssw0rd!',
      JWT_SECRET: 'eep-management-system-super-secret-jwt-key-2024',
      JWT_EXPIRE: '7d',
      MAX_FILE_SIZE: 20971520,
      UPLOAD_PATH: './uploads',
      FRONTEND_URL: 'https://devwooyou.space',
      RATE_LIMIT_WINDOW_MS: 900000,
      RATE_LIMIT_MAX_REQUESTS: 100
    },
    error_file: '/srv/evosolusiont/logs/backend-error.log',
    out_file: '/srv/evosolusiont/logs/backend-out.log',
    log_file: '/srv/evosolusiont/logs/backend-combined.log',
    time: true,
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};

