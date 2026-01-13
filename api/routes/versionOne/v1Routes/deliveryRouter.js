const getRouter = require("../../../utils/getRouter");
const deliveryController = require("../../../controllers/v1/deliveryController");
const { isAuthenticated } = require("../../../middlewares/auth");

const deliveryRouter = getRouter();

deliveryRouter.get(
  "/active",
  isAuthenticated,
  deliveryController.getActiveDeliveries
);
deliveryRouter.get("/history", isAuthenticated, deliveryController.getHistory);

module.exports = deliveryRouter;
