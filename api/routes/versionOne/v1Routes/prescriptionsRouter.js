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
  prescriptionsController.getPrescriptionWithAnalysis,
);

module.exports = prescriptionsRouter;
