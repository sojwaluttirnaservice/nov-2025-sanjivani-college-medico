const getRouter = require("../../../utils/getRouter");
const restockController = require("../../../controllers/v1/restockController");
const { isAuthenticated } = require("../../../middlewares/auth");

const restockRouter = getRouter();

// GET all delivery agents (pharmacy picks one when creating a request)
restockRouter.get(
  "/agents",
  isAuthenticated,
  restockController.getAvailableAgents,
);

// GET restock requests for a pharmacy
restockRouter.get("/", isAuthenticated, restockController.getPharmacyRequests);

// GET restock requests assigned to a delivery agent
restockRouter.get(
  "/agent",
  isAuthenticated,
  restockController.getAgentRequests,
);

// POST create a new restock request (by pharmacy)
restockRouter.post("/", isAuthenticated, restockController.createRequest);

// PATCH fulfill a restock request (by delivery agent)
restockRouter.patch(
  "/:id/fulfill",
  isAuthenticated,
  restockController.fulfillRequest,
);

// PATCH cancel a restock request (by pharmacy)
restockRouter.patch(
  "/:id/cancel",
  isAuthenticated,
  restockController.cancelRequest,
);

module.exports = restockRouter;
