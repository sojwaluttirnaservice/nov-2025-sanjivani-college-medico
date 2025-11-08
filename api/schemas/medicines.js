const { INTEGER, STRING, TEXT, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");

const medicineSchema = sequelize.define(
  "medicines", // Table name: Stores master list of medicines
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique medicine ID",
    },

    name: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "Name of the medicine",
    },

    brand: {
      type: STRING,
      allowNull: true,
      comment: "Brand or manufacturer name",
    },

    category: {
      type: STRING,
      allowNull: true,
      comment: "Type of medicine (e.g., Antibiotic, Painkiller, etc.)",
    },

    description: {
      type: TEXT,
      allowNull: true,
      comment: "Short description or usage information of the medicine",
    },

    dosage_form: {
      type: STRING,
      allowNull: true,
      comment: "Form of medicine (Tablet, Syrup, Injection, etc.)",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the medicine was added",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the medicine was last updated",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = medicineSchema;
