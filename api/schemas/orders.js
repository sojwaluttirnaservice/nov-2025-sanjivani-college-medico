
const { INTEGER, STRING, DATE, DECIMAL } = require("sequelize");
const sequelize = require("../config/sequelize");
const Customer = require("./customers");
const Pharmacy = require("./pharmacies");
const Prescription = require("./prescriptions");

const orderSchema = sequelize.define(
  "orders", // Table name: Stores customer orders
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique order ID",
    },

    customer_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
      comment: "Foreign key referencing customers table",
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

    prescription_id: {
      type: INTEGER,
      allowNull: true,
      references: {
        model: Prescription,
        key: "id",
      },
      comment: "Foreign key referencing prescriptions table (if applicable)",
    },

    total_amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: "Total order amount after calculation",
    },

    payment_status: {
      type: STRING,
      allowNull: false,
      defaultValue: "pending",
      comment: "Payment status: pending, paid, refunded",
    },

    order_status: {
      type: STRING,
      allowNull: false,
      defaultValue: "processing",
      comment: "Order stage: processing, ready, dispatched, delivered, cancelled",
    },

    delivery_address: {
      type: STRING,
      allowNull: false,
      comment: "Delivery address for the order",
    },

    placed_at: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Time when the order was placed",
    },

    delivered_at: {
      type: DATE,
      allowNull: true,
      comment: "Timestamp when the order was delivered",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Associations
orderSchema.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});

orderSchema.belongsTo(Pharmacy, {
  foreignKey: "pharmacy_id",
  as: "pharmacy",
});

orderSchema.belongsTo(Prescription, {
  foreignKey: "prescription_id",
  as: "prescription",
});

module.exports = orderSchema;
