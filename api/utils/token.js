const jwt = require("jsonwebtoken");
const config = require("../config/config");
/**
 * Generate JWT token
 * @param {Object} payload - Payload to embed in token (user ID, email, role, etc.)
 * @param {string} [expiresIn='1d'] - Expiration time (1d = 1 day)
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = "1d") => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not set in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};

/**
 * Extracts the JWT token from the Authorization header in the request.
 * Assumes the header is in the format: "Bearer <token>"
 *
 * @param {import('express').Request} req - Express request object
 * @returns {string | null} - Returns the token if present, otherwise null
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

/**
 * Verifies a JWT token using the configured secret key.
 *
 * @param {string} receivedToken - The JWT token to verify
 * @param {boolean} [ignoreExpiration=false] - Whether to ignore token expiration
 * @returns {object | null} - Returns the decoded payload if valid, otherwise null
 */
const verifyToken = (receivedToken, ignoreExpiration = false) => {
  try {
    const secretKey = config.security.jwtSecret;
    const decoded = jwt.verify(receivedToken, secretKey, {
      ignoreExpiration,
    });
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
};

module.exports = {
  generateToken,
  extractToken,
  verifyToken,
};
