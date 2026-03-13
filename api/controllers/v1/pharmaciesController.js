const pharmaciesModel = require("../../models/pharmacies.model");
const asyncHandler = require("../../utils/asyncHandler");
const { sendError, sendSuccess } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");
const inventoryService = require("../../services/inventoryService");

/**
 * Create or Update pharmacy profile
 * - If pharmacy exists → update
 * - If not → create
 */
const pharmaciesController = {
  upsertPharmacy: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const {
      pharmacy_name,
      license_no,
      contact_no,
      address,
      city,
      pincode,
      default_delivery_agent_id,
    } = req.body;

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
      default_delivery_agent_id: default_delivery_agent_id || null,
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
    const insertResult = await pharmaciesModel.create(payload);

    // Seed default inventory for the newly created pharmacy
    try {
      if (insertResult && insertResult.insertId) {
        await inventoryService.seedDefaultInventory(insertResult.insertId);
      } else {
        // Fallback: fetch the pharmacy we just created to get its ID
        const newPharmacy = await pharmaciesModel.checkByUserId(userId);
        if (newPharmacy && newPharmacy.length > 0) {
          await inventoryService.seedDefaultInventory(
            newPharmacy[0].pharmacy_id,
          );
        }
      }
    } catch (err) {
      console.error("Error seeding default inventory:", err);
      // We don't fail the request if seeding fails, as the profile is already created
    }

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
   * Get pharmacy by ID
   */
  getPharmacyById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pharmacyData = await pharmaciesModel.getById(id);

    // Provide robust checking for array response
    const pharmacy =
      Array.isArray(pharmacyData) && pharmacyData.length
        ? pharmacyData[0]
        : null;

    if (!pharmacy) {
      return sendError(res, STATUS.NOT_FOUND, "Pharmacy not found");
    }

    return sendSuccess(res, STATUS.OK, "Pharmacy details fetched", {
      pharmacy,
    });
  }),

  /**
   * Get all pharmacies (for customers)
   */
  getAllPharmacies: asyncHandler(async (req, res) => {
    const { search, city, pincode } = req.query;
    const pharmacies = await pharmaciesModel.getAll(search, city, pincode);

    console.log(pharmacies);

    return sendSuccess(res, STATUS.OK, "Pharmacies fetched successfully", {
      pharmacies,
    });
  }),
};

module.exports = pharmaciesController;
