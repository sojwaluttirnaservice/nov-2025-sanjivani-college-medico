const { analyzePrescription } = require("../../services/extractPrescription");
const asyncHandler = require("../../utils/asyncHandler");
const { UPLOAD_PATHS } = require("../../utils/files/filePaths");
const { sendResponse } = require("../../utils/responses/ApiResponse");

const prescriptionsController = {
  readPrescriptions: asyncHandler(async (req, res) => {
    console.log(req.files);

    let path = `${UPLOAD_PATHS.prescriptions.absolutePath}/jZ171123684_557231_1767813690716.jpg`;
    let analysedResult = await analyzePrescription(path);
    // console.log(result);
    return sendResponse(res, 200, true, "Prescriptions analyzed successfully", {
      analysedResult,
    });
  }),
};

module.exports = prescriptionsController;
