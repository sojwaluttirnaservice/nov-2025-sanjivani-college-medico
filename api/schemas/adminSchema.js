const { INTEGER, STRING, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");

const adminSchema = sequelize.define(
    "admins", // Table name: Stores admin user credentials
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: "Primary key: Unique ID for each admin user",
        },

        username: {
            type: STRING,
            allowNull: false,
            unique: true,
            comment: "Unique username for the admin login",
        },

        password: {
            type: STRING,
            allowNull: false,
            comment: "Hashed password for the admin",
        },

        createdAt: {
            type: DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
            comment: "Timestamp when the admin was created",
        },

        updatedAt: {
            type: DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
            allowNull: false,
            comment: "Timestamp when the admin was last updated",
        },
    },
    {
        timestamps: true, // Enables createdAt & updatedAt
    }
);

module.exports = adminSchema;
