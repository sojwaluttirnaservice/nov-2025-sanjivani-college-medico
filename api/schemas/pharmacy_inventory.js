const { INTEGER, DECIMAL, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const Pharmacy = require("./pharmacies");
const Medicine = require("./medicines");

const pharmacyInventorySchema = sequelize.define(
  "pharmacy_inventory", // Table name: Tracks pharmacy-wise medicine stock
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique inventory record ID",
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

    quantity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Current available stock quantity of the medicine",
    },

    price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      comment: "Selling price per unit of the medicine",
    },

    expiry_date: {
      type: DATE,
      allowNull: true,
      comment: "Expiry date of the current stock batch",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the inventory record was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the inventory was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Associations
pharmacyInventorySchema.belongsTo(Pharmacy, {
  foreignKey: "pharmacy_id",
  as: "pharmacy",
});

pharmacyInventorySchema.belongsTo(Medicine, {
  foreignKey: "medicine_id",
  as: "medicine",
});

module.exports = pharmacyInventorySchema;
