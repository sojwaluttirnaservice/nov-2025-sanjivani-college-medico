const { ENUM, INTEGER, STRING, DATE, BOOLEAN } = require("sequelize");
const sequelize = require("../config/sequelize");

const userSchema = sequelize.define(
  "users", // Table name: Stores user account information
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary key: Unique user ID",
    },

    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: "User's email for communication and login",
    },

    password: {
      type: STRING,
      allowNull: false,
      comment: "Hashed password for the user",
    },

    role: {
      type: ENUM("CUSTOMER", "ADMIN", "PHARMANCY", "DELIVERY_AGENT"),
      allowNull: false,
    },

    is_active: {
      type: BOOLEAN,
      defaultValue: true,
      comment: "Account status: true = active, false = deactivated",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      comment: "Timestamp when the user account was created",
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
      comment: "Timestamp when the user was last updated",
    },
  },
  {
    timestamps: true,
  }
);

// Association

module.exports = userSchema;
