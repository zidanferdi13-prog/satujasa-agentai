module.exports = {
  apps: [{
    name: 'stnk-api',
    script: './dist/server.js',
    cwd: '/opt/stnk-ai-team/projects/stnk-jasa/apps/api',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: '/var/log/stnk-api/error.log',
    out_file: '/var/log/stnk-api/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
