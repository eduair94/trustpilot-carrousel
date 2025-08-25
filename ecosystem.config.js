module.exports = {
  apps: [
    {
      name: 'trustpilot-carrousel-demo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: __dirname,
      env: {
        PORT: 4828,
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      // Auto restart on crashes
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // Logging
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Memory and CPU limits
      max_memory_restart: '1G',
      // Prevent running as iframe for demo page
      // (iframe security blocking is handled in DemoPage.tsx)
    },
  ],
};
