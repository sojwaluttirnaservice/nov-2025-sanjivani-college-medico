const restockRequestModel = require("../models/restockRequest.model");
const inventoryModel = require("../models/inventory.model");

const restockService = {
  // Pharmacy creates a restock request for a low-stock medicine
  createRequest: async (data) => {
    if (!data.pharmacy_id || !data.medicine_id || !data.quantity_requested) {
      throw new Error(
        "pharmacy_id, medicine_id, and quantity_requested are required",
      );
    }
    if (data.quantity_requested <= 0) {
      throw new Error("quantity_requested must be a positive number");
    }
    return await restockRequestModel.create(data);
  },

  // Delivery agent fulfills the request → stock added to pharmacy inventory
  fulfillRequest: async (requestId) => {
    // 1. Fetch the request
    const request = await restockRequestModel.getById(requestId);
    if (!request) throw new Error("Restock request not found");

    if (request.status === "fulfilled") {
      throw new Error("This request has already been fulfilled");
    }
    if (request.status === "cancelled") {
      throw new Error("Cannot fulfill a cancelled request");
    }

    // 2. Generate batch number for the new stock
    const batchNo =
      "RESTOCK-" + requestId + "-" + Date.now().toString().slice(-6);

    // 3. Add stock to pharmacy inventory
    const expiryDate = request.expiry_date
      ? new Date(request.expiry_date).toISOString().split("T")[0]
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]; // 1 year default

    await inventoryModel.addStock({
      pharmacyId: request.pharmacy_id,
      medicineId: request.medicine_id,
      quantity: request.quantity_requested,
      price: request.price || 0,
      expiryDate,
      batch_no: batchNo,
    });

    // 4. Update request status to fulfilled
    await restockRequestModel.updateStatus(requestId, "fulfilled", batchNo);

    return { batchNo, quantityAdded: request.quantity_requested };
  },

  // Pharmacy cancels a pending request
  cancelRequest: async (requestId) => {
    const request = await restockRequestModel.getById(requestId);
    if (!request) throw new Error("Restock request not found");

    if (request.status === "fulfilled") {
      throw new Error("Cannot cancel a fulfilled request");
    }
    if (request.status === "cancelled") {
      throw new Error("Request is already cancelled");
    }

    await restockRequestModel.updateStatus(requestId, "cancelled");
    return true;
  },
};

module.exports = restockService;
