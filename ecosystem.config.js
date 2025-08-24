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
      // Prevent running as iframe for demo page
      // (see below for custom middleware suggestion)
    },
  ],
};
