const pharmaciesModel = require("../../models/pharmacies.model");
const asyncHandler = require("../../utils/asyncHandler");
const { sendError, sendSuccess } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

/**
 * Create or Update pharmacy profile
 * - If pharmacy exists → update
 * - If not → create
 */
const pharmaciesController = {
  upsertPharmacy: asyncHandler(async (req, res) => {
    const userId = req.body.user_id;

    const { pharmacy_name, license_no, contact_no, address, city, pincode } =
      req.body;

    // Basic validation
    if (!pharmacy_name || !license_no || !contact_no || !address) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "Pharmacy name, license number, contact number and address are required",
      );
    }

    // Check if pharmacy already exists for this user
    const existingPharmacy = await pharmaciesModel.checkByUserId(userId);

    // Payload
    const payload = {
      user_id: userId,
      pharmacy_name,
      license_no,
      contact_no,
      address,
      city: city || null,
      pincode: pincode || null,
    };

    // UPDATE
    if (existingPharmacy && existingPharmacy.length) {
      await pharmaciesModel.updateByUserId(userId, payload);

      return sendSuccess(
        res,
        STATUS.OK,
        "Pharmacy profile updated successfully",
      );
    }

    // CREATE
    await pharmaciesModel.create(payload);

    return sendSuccess(
      res,
      STATUS.CREATED,
      "Pharmacy profile created successfully",
    );
  }),

  /**
   * Get logged-in pharmacy profile
   */
  getProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const pharmacy = await pharmaciesModel.checkByUserId(userId);

    if (!pharmacy || !pharmacy.length) {
      return sendSuccess(res, STATUS.OK, "Pharmacy profile not found", {
        exists: false,
        profile: null,
      });
    }

    return sendSuccess(res, STATUS.OK, "Pharmacy profile fetched", {
      exists: true,
      profile: pharmacy[0],
    });
  }),

  /**
   * Get all pharmacies (for customers)
   */
  getAllPharmacies: asyncHandler(async (req, res) => {
    const { search } = req.query;
    const pharmacies = await pharmaciesModel.getAll(search);

    return sendSuccess(res, STATUS.OK, "Pharmacies fetched successfully", {
      pharmacies,
    });
  }),
};

module.exports = pharmaciesController;
