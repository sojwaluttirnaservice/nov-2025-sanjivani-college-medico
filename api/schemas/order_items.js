const { INTEGER, DECIMAL, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const Order = require("./orders");
const Medicine = require("./medicines");

const orderItemSchema = sequelize.define(
  "order_items", // Table name: Stores details of medicines in each order
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique item ID per order line",
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

    medicine_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Medicine,
        key: "id",
      },
      comment: "Foreign key referencing medicines table",
    },

    quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Quantity of the medicine ordered",
    },

    unit_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      comment: "Price per unit of medicine at order time",
    },

    subtotal: {
      type: DECIMAL(10, 2),
      allowNull: false,
      comment: "Calculated as quantity × unit_price",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the record was created",
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

// Associations
orderItemSchema.belongsTo(Order, { foreignKey: "order_id", as: "order" });
orderItemSchema.belongsTo(Medicine, { foreignKey: "medicine_id", as: "medicine" });

module.exports = orderItemSchema;
