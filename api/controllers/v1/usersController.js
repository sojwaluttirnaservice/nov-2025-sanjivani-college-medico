const customersModel = require("../../models/customers.model");
const pharmaciesModel = require("../../models/pharmacies.model");
const usersModel = require("../../models/users.model");
const asyncHandler = require("../../utils/asyncHandler");
const APP_ROLES = require("../../utils/checks/roles");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");
const {
  generateToken,
  extractToken,
  decodeToken,
} = require("../../utils/token");

/**
 * Simple input validation
 * @param {Object} fields
 * @param {string} fields.email
 * @param {string} fields.password
 * @param {string} fields.role
 * @returns {string|null} error message or null if valid
 */
const validateUserInput = ({ email, password, role }) => {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "Valid email is required.";
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password is required and must be at least 6 characters.";
  }
  if (!role || typeof role !== "string") {
    return "Role is required.";
  }
  return null;
};

const usersController = {
  createUser: asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    // Validate input
    const validationError = validateUserInput({ email, password, role });
    if (validationError) {
      return sendError(res, STATUS.BAD_REQUEST, validationError);
    }

    // Check if user already exists
    const [existingUser] = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return sendError(
        res,
        STATUS.CONFLICT,
        "User with this email already exists.",
      );
    }

    await usersModel.createUser({ email, password, role });

    return sendSuccess(res, STATUS.CREATED, "Signup successful");
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    // Validate input
    const validationError = validateUserInput({ email, password, role });
    if (validationError) {
      return sendError(res, STATUS.BAD_REQUEST, validationError);
    }

    const [existingUser] = await usersModel.getUserByEmail(email);

    if (!existingUser) {
      return sendError(res, STATUS.NOT_FOUND, "User not found.");
    }

    if (existingUser.password !== password) {
      return sendError(res, STATUS.NOT_FOUND, "Invalid Credentials");
    }

    const user = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = generateToken(user);

    return sendSuccess(res, STATUS.OK, "Login Successful", { user, token });
  }),

  verifyUser: asyncHandler(async (req, res) => {
    // req.user is populated by the auth middleware
    const user = req.user;
    return sendSuccess(res, STATUS.OK, "User verified", { user });
  }),

  getProfile: asyncHandler(async (req, res) => {
    // req.user is already populated by auth middleware
    const { id: userId, role } = req.user;

    let user;

    if (role === APP_ROLES.CUSTOMER) {
      user = await customersModel.getWithUser(userId);
    } else if (role === APP_ROLES.PHARMACY) {
      user = await pharmaciesModel.getWithUser(userId);
    } else if (role === APP_ROLES.DELIVERY_AGENT) {
      // user = await deliveryAgentModel.getWithUser(userId);
    } else {
      return sendError(res, STATUS.FORBIDDEN, "Role not supported");
    }

    if (!user) {
      return sendError(res, STATUS.NOT_FOUND, "User profile not found");
    }

    return sendSuccess(res, STATUS.OK, "User Fetched Successfully", { user });
  }),
};

module.exports = usersController;
