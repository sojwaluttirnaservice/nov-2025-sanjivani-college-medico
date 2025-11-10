const { INTEGER, STRING, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");

const roleSchema = sequelize.define(
  "roles", // Table name: defines different user roles
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique role ID",
    },

    role_name: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "Role name such as 'admin', 'customer', 'pharmacy', 'delivery_agent'",
    },

    description: {
      type: STRING,
      allowNull: true,
      comment: "Optional short description for the role",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the role was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the role was last updated",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = roleSchema;
