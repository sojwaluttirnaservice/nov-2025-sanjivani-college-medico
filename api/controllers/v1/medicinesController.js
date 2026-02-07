const medicinesModel = require("../../models/medicines.model");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

const medicinesController = {
  searchMedicines: asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return sendSuccess(res, STATUS.OK, "Enter at least 2 characters", []);
    }

    const medicines = await medicinesModel.search(q);
    return sendSuccess(res, STATUS.OK, "Medicines found", medicines);
  }),
};

module.exports = medicinesController;
