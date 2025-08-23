module.exports = {
  apps: [
    {
      name: 'trustpilot-carrousel-demo',
      script: '.output/server/index.mjs',
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
