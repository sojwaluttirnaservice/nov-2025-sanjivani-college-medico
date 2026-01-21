require("dotenv").config();

/**
 * @typedef {Object} DatabaseConfig
 * @property {string} host - Hostname or IP address where the database server is running.
 * @property {string} user - Username used to authenticate with the database.
 * @property {string} password - Password used to authenticate with the database.
 * @property {string} database - Name of the database to connect to.
 * @property {number} port - Port number on which the database server is listening.
 */

/**
 * @typedef {Object} ServerConfig
 * @property {number} port - Port number on which the server will run.
 * @property {string} env - The current environment (e.g., "DEV" or "PROD").
 */

/**
 * @typedef {Object} SecurityConfig
 * @property {string} jwtSecret - Secret key used for signing JWTs (JSON Web Tokens).
 * @property {string} sessionSecret - Secret key used for securing user sessions.
 */

/**
 * @typedef {Object} Config
 * @property {DatabaseConfig} db - Configuration for the MySQL database connection.
 * @property {string | undefined} allowedOrigin - URL allowed by CORS policy to access the API (e.g., frontend URL).
 * @property {ServerConfig} server - Configuration for the server runtime.
 * @property {SecurityConfig} security - Security-related secrets for authentication and sessions.
 */

/**
 * Current environment identifier.
 * Can be set via `PROJECT_ENV` environment variable.
 * Defaults to `"DEV"` if not specified.
 * @type {string}
 */
const ENV = process.env.PROJECT_ENV || "DEV";

/**
 * Environment-specific application configurations.
 * Each environment (DEV, PROD) defines its own database, server, and security settings.
 * @type {Record<string, Config>}
 */
const configs = {
  DEV: {
    db: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "dev_db",
      port: Number(process.env.DB_PORT) || 3306,
    },
    allowedOrigin: process.env.ALLOWED_ORIGIN,
    server: {
      port: Number(process.env.PORT) || 5000,
      env: ENV,
    },
    security: {
      jwtSecret: process.env.JWT_SECRET_KEY || "default_jwt_secret",
      sessionSecret: process.env.SESSION_SECRET || "default_session_secret",
    },
  },
  PROD: {
    db: {
      host: process.env.DB_HOST_PROD || "prod-db-host",
      user: process.env.DB_USER_PROD || "prod_user",
      password: process.env.DB_PASSWORD_PROD || "prod_password",
      database: process.env.DB_DATABASE_PROD || "prod_db",
      port: Number(process.env.DB_PORT_PROD) || 3306,
    },
    allowedOrigin: process.env.ALLOWED_ORIGIN_PROD,
    server: {
      port: Number(process.env.PORT) || 5000,
      env: ENV,
    },
    security: {
      jwtSecret: process.env.JWT_SECRET_KEY_PROD || "prod_jwt_secret",
      sessionSecret: process.env.SESSION_SECRET_PROD || "prod_session_secret",
    },
  },
};

module.exports = configs[ENV];
