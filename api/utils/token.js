const jwt = require("jsonwebtoken");
const config = require("../config/config");

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
    extractToken,
    verifyToken,
};
