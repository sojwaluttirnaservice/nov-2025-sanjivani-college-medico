const { devAnalysedResult } = require("../../data/dev-data/prescription");
const prescriptionAnalysisModel = require("../../models/prescriptionAnalysis.model");
const prescriptionsModel = require("../../models/prescriptions.model");
const { analyzePrescription } = require("../../services/extractPrescription");
const asyncHandler = require("../../utils/asyncHandler");
const { UPLOAD_PATHS } = require("../../utils/files/filePaths");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

const prescriptionsController = {
  /**
   * Upload prescription and trigger LLM analysis
   */
  uploadPrescription: asyncHandler(async (req, res) => {
    const { customer_id, pharmacy_id, notes } = req.body;

    // Multer paths
    const fileDBPath = req.fileDBPath; // For DB (/uploads/...)
    const fileAbsolutePath = req.file.fileAbsolutePath; // For server usage

    if (!customer_id || !fileDBPath) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "Customer ID and prescription file are required",
      );
    }

    // 1️⃣ Save prescription to DB
    const result = await prescriptionsModel.create({
      customer_id,
      pharmacy_id,
      file_path: fileDBPath,
      notes,
    });

    const prescriptionId = result.insertId;

    // 2️⃣ Fire-and-forget LLM analysis
    (async () => {
      try {
        const analysis = await analyzePrescription(fileAbsolutePath);

        console.log(analysis);

        await prescriptionAnalysisModel.create({
          prescription_id: prescriptionId,
          extracted_text: analysis.raw_text,
          structured_data: analysis.medicines,
          confidence_score: analysis.average_confidence,
          model_used: analysis.model || "gemini-2.5-flash",
          status: "completed",
        });
      } catch (err) {
        await prescriptionAnalysisModel.markFailed(prescriptionId, err.message);
      }
    })();

    return sendSuccess(
      res,
      STATUS.CREATED,
      "Prescription uploaded successfully. Analysis in progress.",
      { prescription_id: prescriptionId },
    );
  }),

  getPrescriptionWithAnalysis: asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("reading in here");
    // const customerId = req.user.customer_id; // from auth middleware

    const [prescription] = await prescriptionsModel.getById(id);

    if (!prescription) {
      return sendError(res, STATUS.NOT_FOUND, "Prescription not found");
    }

    // 🔐 Ownership check
    // 🔐 Ownership check
    const isCustomerOwner =
      req.user.customer_id && prescription.customer_id === req.user.customer_id;
    const isPharmacyOwner =
      req.user.pharmacy_id && prescription.pharmacy_id === req.user.pharmacy_id;

    if (!isCustomerOwner && !isPharmacyOwner) {
      return sendError(res, STATUS.FORBIDDEN, "Access denied");
    }

    const [analysis] =
      await prescriptionAnalysisModel.getLatestByPrescriptionId(id);

    return sendSuccess(res, STATUS.OK, "Prescription fetched", {
      prescription,
      analysis,
    });
  }),

  /**
   * Get all pending prescription requests for a specific pharmacy
   */
  getPharmacyRequests: asyncHandler(async (req, res) => {
    // Determine pharmacy ID from user profile or query (prioritize token for security)
    const pharmacyId = req.user?.pharmacy_id || req.query.pharmacyId;

    if (!pharmacyId) {
      return sendError(res, STATUS.BAD_REQUEST, "Pharmacy ID is required");
    }

    const requests = await prescriptionsModel.getPendingByPharmacy(pharmacyId);

    return sendSuccess(res, STATUS.OK, "Pending requests fetched", {
      requests,
    });
  }),
};

module.exports = prescriptionsController;

// BACKEND =>
// nodejs (javascript runtime environment), for server : express, Database: MYSQL

// FRONTEND =>
// REACT (javascript library)  + styling (TAILWIND CSS)

// mobile application: React Native
