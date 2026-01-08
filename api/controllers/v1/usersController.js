const usersModel = require("../../models/users.model");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const { generateToken } = require("../../utils/token");

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
      return sendError(res, 400, validationError);
    }

    // Check if user already exists
    const [existingUser] = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, "User with this email already exists.");
    }

    await usersModel.createUser({ email, password, role });

    return sendSuccess(res, 201, "Signup successful");
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    // Validate input
    const validationError = validateUserInput({ email, password, role });
    if (validationError) {
      return sendError(res, 400, validationError);
    }

    const [existingUser] = await usersModel.getUserByEmail(email);

    if (!existingUser) {
      return sendError(res, 404, "User not found.");
    }

    if (existingUser.password !== password) {
      return sendError(res, 401, "Invalid Credentials");
    }

    const user = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = generateToken(user);

    return sendSuccess(res, 200, "Login Successful", { user, token });
  }),
};

module.exports = usersController;
