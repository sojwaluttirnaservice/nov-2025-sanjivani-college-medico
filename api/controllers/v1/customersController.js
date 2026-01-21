const customersModel = require("../../models/customers.model");
const asyncHandler = require("../../utils/asyncHandler");
const { sendError, sendSuccess } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

/**
 * Create or Update customer profile
 * - If profile exists → update
 * - If not → create
 */
const customersController = {
  upsertCustomer: asyncHandler(async (req, res) => {
    const userId = req.body.user_id;

    const { full_name, phone, address, city, pincode } = req.body;

    // Basic validation
    if (!full_name || !phone || !address) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "Full Name, phone and address are required",
      );
    }

    // Check if customer already exists for this user
    const existingCustomer = await customersModel.checkByUserId(userId);

    // Payload
    const payload = {
      user_id: userId,
      full_name,
      phone,
      address,
      city: city || null,
      pincode: pincode || null,
    };

    // UPDATE
    if (existingCustomer && existingCustomer.length) {
      await customersModel.updateByUserId(userId, payload);

      return sendSuccess(
        res,
        STATUS.OK,
        "Customer profile updated successfully",
      );
    }

    // CREATE
    await customersModel.create(payload);

    return sendSuccess(
      res,
      STATUS.CREATED,
      "Customer profile created successfully",
    );
  }),

  /**
   * Get logged-in customer's profile
   */
  getProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [customer] = await customersModel.getByUserId(userId);

    if (!customer) {
      return sendSuccess(res, STATUS.OK, "Customer profile not found", {
        exists: false,
        profile: null,
      });
    }

    return sendSuccess(res, STATUS.OK, "Customer profile fetched", {
      exists: true,
      profile: customer,
    });
  }),
};

module.exports = customersController;
