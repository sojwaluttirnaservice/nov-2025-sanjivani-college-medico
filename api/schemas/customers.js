const { INTEGER, STRING, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./users"); // Link to user schema

const customerSchema = sequelize.define(
  "customers", // Table name: Stores customer-specific details
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique customer ID",
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
      comment: "Customer's full name",
    },

    phone: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "Customer's contact number",
    },

    address: {
      type: STRING,
      allowNull: false,
      comment: "Customer's full address for delivery",
    },

    city: {
      type: STRING,
      allowNull: true,
      comment: "City or town of the customer",
    },

    pincode: {
      type: STRING,
      allowNull: true,
      comment: "Postal code for delivery",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the customer was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the customer was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Association
customerSchema.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = customerSchema;
