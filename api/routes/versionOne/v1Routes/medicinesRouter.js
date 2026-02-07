const getRouter = require("../../../utils/getRouter");
const medicinesController = require("../../../controllers/v1/medicinesController");
const { isAuthenticated } = require("../../../middlewares/auth");

const medicinesRouter = getRouter();

// Search medicines (Public or Protected? Protected seems safer for now)
medicinesRouter.get(
  "/search",
  isAuthenticated,
  medicinesController.searchMedicines,
);

module.exports = medicinesRouter;
