const { INTEGER, STRING, BOOLEAN, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./users");

const deliveryAgentSchema = sequelize.define(
  "delivery_agents", // Table name: Stores delivery agent details
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique delivery agent ID",
    },

    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "Foreign key referencing users table",
    },

    full_name: {
      type: STRING,
      allowNull: false,
      comment: "Full name of the delivery agent",
    },

    phone: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "Contact number of the delivery agent",
    },

    vehicle_number: {
      type: STRING,
      allowNull: true,
      comment: "Vehicle registration number (optional)",
    },

    is_available: {
      type: BOOLEAN,
      defaultValue: true,
      comment: "Availability status: true = available for delivery",
    },

    current_location: {
      type: STRING,
      allowNull: true,
      comment: "Current GPS location or area name of the agent",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the agent profile was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the record was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Association
deliveryAgentSchema.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = deliveryAgentSchema;
