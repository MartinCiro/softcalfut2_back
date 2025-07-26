module.exports = {
  apps: [
    {
      name: "api",
      script: "dist/src/index.js",
      interpreter: "node",
      node_args: "-r tsconfig-paths/register",
      env: {
        NODE_ENV: "production",
        TS_CONFIG_PATHS: "true",
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
