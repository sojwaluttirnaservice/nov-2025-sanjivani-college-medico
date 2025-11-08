const { INTEGER, STRING, DECIMAL, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const Order = require("./orders");

const paymentSchema = sequelize.define(
  "payments", // Table name: Stores payment transaction details
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique payment ID",
    },

    order_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      comment: "Foreign key referencing orders table",
    },

    payment_method: {
      type: STRING,
      allowNull: false,
      comment: "Payment method used (e.g., Razorpay, Google Pay, COD)",
    },

    transaction_id: {
      type: STRING,
      allowNull: true,
      comment: "Unique transaction reference from payment gateway",
    },

    amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
      comment: "Total amount paid for the order",
    },

    status: {
      type: STRING,
      allowNull: false,
      defaultValue: "pending",
      comment: "Payment status: pending, successful, failed, refunded",
    },

    paid_at: {
      type: DATE,
      allowNull: true,
      comment: "Timestamp when the payment was completed",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the payment record was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when payment record was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Association
paymentSchema.belongsTo(Order, { foreignKey: "order_id", as: "order" });

module.exports = paymentSchema;
