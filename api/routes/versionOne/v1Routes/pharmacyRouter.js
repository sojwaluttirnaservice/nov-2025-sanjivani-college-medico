const pharmacyController = require("../../../controllers/v1/pharmacyController");
const { isAuthenticated, isPharmacy } = require("../../../middlewares/auth");
const getRouter = require("../../../utils/getRouter");

const pharmacyRouter = getRouter();

pharmacyRouter.post("/", isPharmacy, pharmacyController.upsertPharmacy);

module.exports = pharmacyRouter;
