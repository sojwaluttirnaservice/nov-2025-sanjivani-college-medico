const restockService = require("../../services/restockService");
const restockRequestModel = require("../../models/restockRequest.model");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

const restockController = {
  // POST /api/v1/restock — Pharmacy creates a restock request
  createRequest: asyncHandler(async (req, res) => {
    const data = {
      pharmacy_id: req.body.pharmacy_id,
      medicine_id: req.body.medicine_id,
      delivery_agent_id: req.body.delivery_agent_id || null,
      quantity_requested: req.body.quantity_requested,
      price: req.body.price || 0,
      expiry_date: req.body.expiry_date || null,
      notes: req.body.notes || null,
    };

    const result = await restockService.createRequest(data);
    return sendSuccess(
      res,
      STATUS.CREATED,
      "Restock request created successfully",
      {
        requestId: result.insertId,
      },
    );
  }),

  // GET /api/v1/restock?pharmacy_id=X — Pharmacy sees their requests
  getPharmacyRequests: asyncHandler(async (req, res) => {
    const pharmacyId = req.query.pharmacy_id;
    if (!pharmacyId) {
      return sendError(res, STATUS.BAD_REQUEST, "pharmacy_id is required");
    }
    const requests = await restockRequestModel.getByPharmacy(pharmacyId);
    return sendSuccess(res, STATUS.OK, "Pharmacy requests fetched", requests);
  }),

  // GET /api/v1/restock/agent?agent_id=X — Delivery agent sees their requests
  getAgentRequests: asyncHandler(async (req, res) => {
    const agentId = req.query.agent_id;
    if (!agentId) {
      return sendError(res, STATUS.BAD_REQUEST, "agent_id is required");
    }
    const requests = await restockRequestModel.getByAgent(agentId);
    return sendSuccess(res, STATUS.OK, "Agent requests fetched", requests);
  }),

  // PATCH /api/v1/restock/:id/fulfill — Delivery agent fulfills a request
  fulfillRequest: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await restockService.fulfillRequest(id);
    return sendSuccess(
      res,
      STATUS.OK,
      "Request fulfilled! Stock has been added to the pharmacy.",
      result,
    );
  }),

  // PATCH /api/v1/restock/:id/cancel — Pharmacy cancels a pending request
  cancelRequest: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await restockService.cancelRequest(id);
    return sendSuccess(
      res,
      STATUS.OK,
      "Restock request cancelled successfully",
    );
  }),

  // GET /api/v1/restock/agents — Pharmacy gets list of all delivery agents to pick from
  getAvailableAgents: asyncHandler(async (req, res) => {
    const agents = await restockRequestModel.getAllAgents();
    return sendSuccess(
      res,
      STATUS.OK,
      "Available delivery agents fetched",
      agents,
    );
  }),
};

module.exports = restockController;
