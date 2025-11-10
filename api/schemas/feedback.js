const { INTEGER, STRING, TEXT, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const Customer = require("./customers");
const Order = require("./orders");

const feedbackSchema = sequelize.define(
  "feedback", // Table name: Stores customer feedback and ratings
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique feedback ID",
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

    order_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      comment: "Foreign key referencing orders table",
    },

    rating: {
      type: INTEGER,
      allowNull: false,
      comment: "Customer rating (1 to 5 stars)",
    },

    comments: {
      type: TEXT,
      allowNull: true,
      comment: "Optional written feedback by the customer",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when feedback was submitted",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when feedback was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Associations
feedbackSchema.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
feedbackSchema.belongsTo(Order, { foreignKey: "order_id", as: "order" });

module.exports = feedbackSchema;
