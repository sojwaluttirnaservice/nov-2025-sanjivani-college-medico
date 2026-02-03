const pharmaciesController = require("../../../controllers/v1/pharmaciesController");
const { isAuthenticated, isPharmacy } = require("../../../middlewares/auth");
const getRouter = require("../../../utils/getRouter");

const pharmaciesRouter = getRouter();

pharmaciesRouter.post("/", isPharmacy, pharmaciesController.upsertPharmacy);

pharmaciesRouter.get(
  "/",
  isAuthenticated,
  pharmaciesController.getAllPharmacies,
);

module.exports = pharmaciesRouter;
