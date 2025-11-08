const { INTEGER, STRING, DATE, BOOLEAN, TEXT } = require("sequelize");
const sequelize = require("../config/sequelize");
const Customer = require("./customers");
const Pharmacy = require("./pharmacies");

const prescriptionSchema = sequelize.define(
  "prescriptions", // Table name: Stores uploaded prescriptions
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique prescription ID",
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
      allowNull: true,
      references: {
        model: Pharmacy,
        key: "id",
      },
      comment: "Foreign key referencing pharmacy table (if assigned)",
    },

    file_path: {
      type: STRING,
      allowNull: false,
      comment: "File path or URL of the uploaded prescription image/PDF",
    },

    notes: {
      type: TEXT,
      allowNull: true,
      comment: "Optional notes or special instructions from the customer",
    },

    is_verified: {
      type: BOOLEAN,
      defaultValue: false,
      comment: "Indicates whether the prescription is verified by the pharmacy",
    },

    verified_by: {
      type: INTEGER,
      allowNull: true,
      comment: "User ID of the pharmacist/admin who verified the prescription",
    },

    verified_at: {
      type: DATE,
      allowNull: true,
      comment: "Timestamp when the prescription was verified",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the prescription was uploaded",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the prescription was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Associations
prescriptionSchema.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});

prescriptionSchema.belongsTo(Pharmacy, {
  foreignKey: "pharmacy_id",
  as: "pharmacy",
});

module.exports = prescriptionSchema;
