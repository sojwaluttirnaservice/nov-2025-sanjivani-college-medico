const prescriptionsController = require("../../../controllers/v1/prescriptionsController");
const configureMulter = require("../../../middlewares/upload");
const { UPLOAD_PATHS } = require("../../../utils/files/filePaths");
const getRouter = require("../../../utils/getRouter");

const prescriptionsRouter = getRouter();

const upload = configureMulter(UPLOAD_PATHS.prescriptions.absolutePath);

prescriptionsRouter.post(
  "/upload",
  upload.single("prescription"),
  prescriptionsController.uploadPrescription,
);

prescriptionsRouter.get(
  "/analysis/:id",
  require("../../../middlewares/auth").isAuthenticated,
  prescriptionsController.getPrescriptionWithAnalysis,
);

// [NEW] Get all pending requests for a pharmacy
prescriptionsRouter.get(
  "/requests",
  require("../../../middlewares/auth").isAuthenticated,
  prescriptionsController.getPharmacyRequests,
);

module.exports = prescriptionsRouter;
