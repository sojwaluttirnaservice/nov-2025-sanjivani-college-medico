const deliveriesModel = require("../../models/deliveries.model");
const deliveryAgentsModel = require("../../models/deliveryAgents.model");
const { query } = require("../../utils/query/query");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess, sendError } = require("../../utils/responses/ApiResponse");
const STATUS = require("../../utils/status");

const deliveryController = {
  getActiveDeliveries: asyncHandler(async (req, res) => {
    const tasks = await deliveriesModel.getActiveDeliveries(req.user?.id);
    return sendSuccess(res, STATUS.OK, "Active deliveries fetched", tasks);
  }),

  getHistory: asyncHandler(async (req, res) => {
    const history = await deliveriesModel.getHistory(req.user?.id);
    return sendSuccess(res, STATUS.OK, "Delivery history fetched", history);
  }),

  // GET /deliveries/profile — fetch agent's own profile
  getProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const profileArray = await deliveryAgentsModel.getWithUser(userId);
    const profile =
      profileArray && profileArray.length > 0 ? profileArray[0] : null;
    return sendSuccess(res, STATUS.OK, "Agent profile fetched", profile);
  }),

  // PUT /deliveries/profile — create or update agent profile
  saveProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { full_name, phone, vehicle_number } = req.body;

    if (!full_name || !phone) {
      return sendError(
        res,
        STATUS.BAD_REQUEST,
        "full_name and phone are required",
      );
    }

    // Check if profile exists
    const [existing] = await deliveryAgentsModel.checkByUserId(userId);

    if (existing) {
      // Update existing profile
      await query(
        `UPDATE delivery_agents SET full_name=?, phone=?, vehicle_number=? WHERE user_id=?`,
        [full_name, phone, vehicle_number || null, userId],
      );
    } else {
      // Create new profile
      await deliveryAgentsModel.create({
        user_id: userId,
        full_name,
        phone,
        vehicle_number,
      });
    }

    // Return updated profile with agent_id
    const [updated] = await deliveryAgentsModel.checkByUserId(userId);
    console.log(updated);
    return sendSuccess(res, STATUS.OK, "Profile saved successfully", {
      profile: updated,
    });
  }),

  // GET /deliveries/all — fetch all delivery agents for pharmacies to choose from
  getAllAgents: asyncHandler(async (req, res) => {
    const agents = await deliveryAgentsModel.getAll();
    return sendSuccess(res, STATUS.OK, "All delivery agents fetched", {
      agents,
    });
  }),
};

module.exports = deliveryController;
