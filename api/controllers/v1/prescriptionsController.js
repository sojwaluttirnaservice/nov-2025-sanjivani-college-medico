const { devAnalysedResult } = require("../../data/dev-data/prescription");
const { analyzePrescription } = require("../../services/extractPrescription");
const asyncHandler = require("../../utils/asyncHandler");
const { UPLOAD_PATHS } = require("../../utils/files/filePaths");
const { sendSuccess } = require("../../utils/responses/ApiResponse");

const prescriptionsController = {
  uploadPrescription: asyncHandler(async (req, res) => {

    let path = `${UPLOAD_PATHS.prescriptions.absolutePath}/fIaZi762778_145170_1768286033149.jpg`;
    
    // let analysedResult = await analyzePrescription(path);

    let prescriptionAnalysis = devAnalysedResult

    return sendSuccess(res, 200, true, "Prescriptions analyzed successfully", {
      prescriptionAnalysis,
    });
  }),
};

module.exports = prescriptionsController;
