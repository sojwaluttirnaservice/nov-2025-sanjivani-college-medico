const { INTEGER, STRING, TEXT, BOOLEAN, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./users");

const notificationSchema = sequelize.define(
  "notifications", // Table name: Stores user notifications and alerts
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique notification ID",
    },

    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "Foreign key referencing users table (notification receiver)",
    },

    title: {
      type: STRING,
      allowNull: false,
      comment: "Short title of the notification (e.g., Order Shipped)",
    },

    message: {
      type: TEXT,
      allowNull: false,
      comment: "Detailed message content of the notification",
    },

    type: {
      type: STRING,
      allowNull: true,
      comment: "Type of notification (order_update, reminder, system, etc.)",
    },

    is_read: {
      type: BOOLEAN,
      defaultValue: false,
      comment: "Indicates whether the user has read the notification",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the notification was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the notification was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Association
notificationSchema.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = notificationSchema;
