module.exports = {
  apps: [{
    name: 'stnk-web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/opt/stnk-ai-team/projects/stnk-jasa/apps/frontend',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_URL: 'http://43.134.164.221/api/v1'
    },
    error_file: '/var/log/stnk-web/error.log',
    out_file: '/var/log/stnk-web/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
