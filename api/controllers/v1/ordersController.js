const ordersModel = require("../../models/orders.model");
const orderService = require("../../services/orderService");
const asyncHandler = require("../../utils/asyncHandler");
const { sendError, sendSuccess } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

const ordersController = {
  // Get all orders for a pharmacy
  getOrders: asyncHandler(async (req, res) => {
    const pharmacyId = req.user?.pharmacy_id || req.query.pharmacyId;
    if (!pharmacyId)
      return sendError(res, STATUS.BAD_REQUEST, "Pharmacy ID is required");

    const orders = await ordersModel.getOrdersByPharmacyId(pharmacyId);
    return sendSuccess(res, STATUS.OK, "Orders fetched successfully", {
      orders,
    });
  }),

  // Get details of a specific order including items
  getOrderDetails: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await ordersModel.getOrderDetails(id);
    if (!order) {
      return sendError(res, STATUS.NOT_FOUND, "Order not found");
    }
    return sendSuccess(res, STATUS.OK, "Order details fetched", { order });
  }),

  // [NEW] Create Order via Service (Handles Inventory & COD logic)
  createOrder: asyncHandler(async (req, res) => {
    const { customer_id, pharmacy_id, prescription_id, items } = req.body;

    if (!pharmacy_id || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "Missing required fields or invalid items array",
      );
    }

    const isValid = items.every(
      (item) =>
        item.medicine_id && item.batch_id && item.quantity && item.price,
    );
    if (!isValid) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "Each item must have medicine_id, batch_id, quantity, and price.",
      );
    }

    // Call service to handle business logic
    const result = await orderService.createOrder({
      customer_id: customer_id || req.user.id, // Use passed id or logged in user
      pharmacy_id,
      prescription_id,
      items,
    });

    return sendSuccess(
      res,
      STATUS.CREATED,
      "Order created successfully",
      result,
    );
  }),

  // Update order status (Generic)
  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await ordersModel.updateStatus(id, status);
    return sendSuccess(res, STATUS.OK, "Order status updated");
  }),

  // [NEW] Mark as Delivered (Triggers Revenue & Payment completion)
  deliverOrder: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Call service to handle COD completion and inventory consistency check if needed
    const result = await orderService.markDelivered(id);

    return sendSuccess(
      res,
      STATUS.OK,
      "Order marked as delivered and payment collected",
      result,
    );
  }),

  // [NEW] Get pharmacy stats for dashboard
  getStats: asyncHandler(async (req, res) => {
    const pharmacyId = req.user?.pharmacy_id || req.query.pharmacyId;
    if (!pharmacyId)
      return sendError(res, STATUS.BAD_REQUEST, "Pharmacy ID is required");

    const stats = await ordersModel.getStats(pharmacyId);
    return sendSuccess(res, STATUS.OK, "Stats fetched successfully", { stats });
  }),
};

module.exports = ordersController;
