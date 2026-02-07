const getRouter = require("../../../utils/getRouter");
const inventoryController = require("../../../controllers/v1/inventoryController");
const { isAuthenticated } = require("../../../middlewares/auth");

const inventoryRouter = getRouter();

inventoryRouter.get("/", isAuthenticated, inventoryController.getInventory);
inventoryRouter.get(
  "/batches",
  isAuthenticated,
  inventoryController.getMedicineBatches,
);
inventoryRouter.post("/sell", isAuthenticated, inventoryController.sellItem);
inventoryRouter.get(
  "/alerts/low-stock",
  isAuthenticated,
  inventoryController.getLowStockAlerts,
);
inventoryRouter.post("/", isAuthenticated, inventoryController.addStock);

module.exports = inventoryRouter;
