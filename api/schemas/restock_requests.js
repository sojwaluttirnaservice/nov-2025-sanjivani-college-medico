const { INTEGER, STRING, TEXT, DATE, DECIMAL } = require("sequelize");
const sequelize = require("../config/sequelize");
const Pharmacy = require("./pharmacies");
const Medicine = require("./medicines");
const DeliveryAgent = require("./delivery_agents");

const restockRequestSchema = sequelize.define(
  "restock_requests",
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique restock request ID",
    },

    pharmacy_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Pharmacy,
        key: "id",
      },
      comment: "Foreign key referencing pharmacies table",
    },

    medicine_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Medicine,
        key: "id",
      },
      comment: "Foreign key referencing medicines table",
    },

    delivery_agent_id: {
      type: INTEGER,
      allowNull: true,
      references: {
        model: DeliveryAgent,
        key: "id",
      },
      comment:
        "Foreign key referencing delivery_agents table (nullable until agent accepts)",
    },

    quantity_requested: {
      type: INTEGER,
      allowNull: false,
      comment: "Quantity of medicine requested for restock",
    },

    price: {
      type: DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Price per unit for the restocked stock",
    },

    expiry_date: {
      type: DATE,
      allowNull: true,
      comment: "Expected expiry date for the new stock batch",
    },

    status: {
      type: STRING,
      allowNull: false,
      defaultValue: "pending",
      comment: "Status: pending, fulfilled, cancelled",
    },

    batch_no: {
      type: STRING,
      allowNull: true,
      comment: "Auto-generated batch number assigned on fulfillment",
    },

    notes: {
      type: TEXT,
      allowNull: true,
      comment: "Optional notes from pharmacy regarding the restock request",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

// Associations
restockRequestSchema.belongsTo(Pharmacy, {
  foreignKey: "pharmacy_id",
  as: "pharmacy",
});
restockRequestSchema.belongsTo(Medicine, {
  foreignKey: "medicine_id",
  as: "medicine",
});
restockRequestSchema.belongsTo(DeliveryAgent, {
  foreignKey: "delivery_agent_id",
  as: "delivery_agent",
});

module.exports = restockRequestSchema;
