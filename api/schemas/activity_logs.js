const { INTEGER, STRING, TEXT, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./users");

const activityLogSchema = sequelize.define(
  "activity_logs", // Table name: Tracks actions performed by users or admins
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique log entry ID",
    },

    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "Foreign key referencing users table (who performed the action)",
    },

    action: {
      type: STRING,
      allowNull: false,
      comment: "Short action description (e.g., 'Order Approved', 'Stock Updated')",
    },

    module: {
      type: STRING,
      allowNull: true,
      comment: "Optional module name related to the action (e.g., 'Orders', 'Pharmacy')",
    },

    details: {
      type: TEXT,
      allowNull: true,
      comment: "Detailed description or metadata about the action",
    },

    ip_address: {
      type: STRING,
      allowNull: true,
      comment: "IP address from where the action was triggered (for audit)",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the log was created",
    },
  },
  {
    timestamps: true,
  }
);

// Association
activityLogSchema.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = activityLogSchema;
