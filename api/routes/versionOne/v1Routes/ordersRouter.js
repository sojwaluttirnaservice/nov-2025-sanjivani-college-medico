const getRouter = require("../../../utils/getRouter");
const ordersController = require("../../../controllers/v1/ordersController");
const { isAuthenticated } = require("../../../middlewares/auth");

const ordersRouter = getRouter();

// Get list of orders
ordersRouter.get("/", isAuthenticated, ordersController.getOrders);

// [NEW] Get pharmacy stats
ordersRouter.get("/stats", isAuthenticated, ordersController.getStats);

// [NEW] Get my orders (Customer)
ordersRouter.get("/my-orders", isAuthenticated, ordersController.getMyOrders);

// Create new order (Handles inventory deduction)
ordersRouter.post("/", isAuthenticated, ordersController.createOrder);

// Get specific order details
ordersRouter.get("/:id", isAuthenticated, ordersController.getOrderDetails);

// Generic status update
ordersRouter.patch(
  "/:id/status",
  isAuthenticated,
  ordersController.updateStatus,
);

// Dedicated delivery completion (Handles COD payment)
ordersRouter.patch(
  "/:id/deliver",
  isAuthenticated,
  ordersController.deliverOrder,
);

// Reject/Cancel order
ordersRouter.patch(
  "/:id/reject",
  isAuthenticated,
  ordersController.rejectOrder,
);

module.exports = ordersRouter;
