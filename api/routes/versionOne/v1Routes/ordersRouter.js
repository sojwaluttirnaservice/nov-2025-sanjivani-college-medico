const getRouter = require("../../../utils/getRouter");
const ordersController = require("../../../controllers/v1/ordersController");
const { isAuthenticated } = require("../../../middlewares/auth");

const ordersRouter = getRouter();

ordersRouter.get("/", isAuthenticated, ordersController.getOrders);
ordersRouter.get("/:id", isAuthenticated, ordersController.getOrderDetails);
ordersRouter.patch(
  "/:id/status",
  isAuthenticated,
  ordersController.updateStatus
);

module.exports = ordersRouter;
