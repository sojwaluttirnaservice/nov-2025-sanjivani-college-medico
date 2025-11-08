const { INTEGER, STRING, DATE, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./users"); // Linking to users table

const pharmacySchema = sequelize.define(
  "pharmacies", // Table name: Stores registered pharmacy details
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique pharmacy ID",
    },

    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "Foreign key referencing users table (pharmacy owner login)",
    },

    pharmacy_name: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "Registered name of the pharmacy/store",
    },

    license_no: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "Official pharmacy license number for validation",
    },

    contact_no: {
      type: STRING,
      allowNull: false,
      comment: "Pharmacy contact number",
    },

    address: {
      type: STRING,
      allowNull: false,
      comment: "Full address of the pharmacy",
    },

    city: {
      type: STRING,
      allowNull: true,
      comment: "City or town where the pharmacy is located",
    },

    pincode: {
      type: STRING,
      allowNull: true,
      comment: "Postal code for the pharmacy location",
    },

    is_verified: {
      type: BOOLEAN,
      defaultValue: false,
      comment: "Indicates whether the pharmacy is verified by admin",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the pharmacy was registered",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the pharmacy record was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Association
pharmacySchema.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = pharmacySchema;
