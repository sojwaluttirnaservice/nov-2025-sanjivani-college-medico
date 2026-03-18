const inventoryModel = require("../../models/inventory.model");
const inventoryService = require("../../services/inventoryService");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

const inventoryController = {
  // GET /api/v1/inventory?pharmacyId=X&page=1&limit=50&search=... — Get all inventory for a pharmacy
  getInventory: asyncHandler(async (req, res) => {
    const pharmacyId = req.query.pharmacyId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    if (!pharmacyId) {
      return sendError(res, STATUS.BAD_REQUEST, "pharmacyId is required");
    }

    const { inventory, totalCount } =
      await inventoryModel.getInventoryByPharmacyId(
        pharmacyId,
        offset,
        limit,
        search,
      );

    return sendSuccess(res, STATUS.OK, "Inventory fetched", {
      inventory,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }),

  // POST /api/v1/inventory — Add a stock batch for a medicine
  addStock: asyncHandler(async (req, res) => {
    const { pharmacyId, medicineId, batch_no, quantity, expiryDate, price } =
      req.body;
    if (!pharmacyId || !medicineId || !quantity || !expiryDate) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "pharmacyId, medicineId, quantity and expiryDate are required",
      );
    }
    await inventoryService.addStock(req.body);
    return sendSuccess(res, STATUS.CREATED, "Stock batch added successfully");
  }),

  // GET /api/v1/inventory/batches?medicineId=X&pharmacyId=Y — Get all batches for a medicine
  getMedicineBatches: asyncHandler(async (req, res) => {
    const { medicineId, pharmacyId } = req.query;
    if (!medicineId) {
      return sendError(res, STATUS.BAD_REQUEST, "medicineId is required");
    }
    if (!pharmacyId) {
      return sendError(res, STATUS.BAD_REQUEST, "pharmacyId is required");
    }
    const batches = await inventoryService.getBatches(medicineId, pharmacyId);
    return sendSuccess(res, STATUS.OK, "Batches fetched", { batches });
  }),

  // POST /api/v1/inventory/sell — Sell/deduct stock from a batch
  sellItem: asyncHandler(async (req, res) => {
    const { batchId, quantity } = req.body;
    if (!batchId || !quantity) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "batchId and quantity are required",
      );
    }
    await inventoryService.sellFromBatch(batchId, quantity);
    return sendSuccess(res, STATUS.OK, "Stock updated successfully");
  }),

  // GET /api/v1/inventory/low-stock?pharmacyId=X&threshold=Y — Get low stock alerts
  getLowStockAlerts: asyncHandler(async (req, res) => {
    const { pharmacyId, threshold = 30 } = req.query;
    if (!pharmacyId) {
      return sendError(res, STATUS.BAD_REQUEST, "pharmacyId is required");
    }
    const alerts = await inventoryModel.getLowStock(pharmacyId, threshold);
    return sendSuccess(res, STATUS.OK, "Low stock alerts fetched", { alerts });
  }),
};

module.exports = inventoryController;
