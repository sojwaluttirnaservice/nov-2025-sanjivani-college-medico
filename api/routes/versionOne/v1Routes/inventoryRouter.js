const getRouter = require("../../../utils/getRouter");
const inventoryController = require("../../../controllers/v1/inventoryController");
const { isAuthenticated } = require("../../../middlewares/auth");

const inventoryRouter = getRouter();

inventoryRouter.get("/", isAuthenticated, inventoryController.getInventory);
inventoryRouter.post("/", isAuthenticated, inventoryController.addStock);

module.exports = inventoryRouter;
