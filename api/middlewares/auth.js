const asyncHandler = require("../utils/asyncHandler");
const { sendResponse } = require("../utils/responses/ApiResponse");
const { extractToken, verifyToken } = require("../utils/token");

const isAdmin = asyncHandler(async (req, res, next) => {
  // verification logic goes here

  const token = extractToken(req);

  if (!token) {
    return sendResponse(res, 401, false, "No token provided.");
  }

  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== "admin") {
    return sendResponse(res, 403, false, "Access denied. Admins only.");
  }

  req.user = decoded;

  next();
});

const isAuthenticated = asyncHandler(async (req, res, next) => {
  // Debug logging
  console.log("Auth Header:", req.headers.authorization);

  const token = extractToken(req);
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("No token found");
    return sendResponse(res, 401, false, "No token provided.");
  }

  const decoded = verifyToken(token);
  console.log("Decoded:", decoded);

  if (!decoded) {
    console.log("Token verification failed");
    return sendResponse(res, 401, false, "Invalid or expired token.");
  }

  req.user = decoded;
  next();
});

module.exports = { isAdmin, isAuthenticated };
