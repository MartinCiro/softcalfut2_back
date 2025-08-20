module.exports = {
  apps: [{
    name: 'api',
    script: 'dist/src/index.js',
    interpreter: "node",
    node_args: '',
    env: {
      NODE_ENV: 'production',
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};