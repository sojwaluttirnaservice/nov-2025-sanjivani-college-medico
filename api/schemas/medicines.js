const { INTEGER, STRING, TEXT, DATE, BOOLEAN, FLOAT } = require("sequelize");
const sequelize = require("../config/sequelize");

const medicineSchema = sequelize.define(
  "medicines",
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: STRING,
      allowNull: false,
    },

    manufacturer: {
      type: STRING,
      allowNull: true,
    },

    type: {
      type: STRING,
      allowNull: true,
      comment: "Tablet, Syrup, Capsule etc",
    },

    price: {
      type: FLOAT,
      allowNull: true,
    },

    pack_size: {
      type: STRING,
      allowNull: true,
      comment: "Strip of 10 tablets etc",
    },

    composition1: {
      type: STRING,
      allowNull: true,
    },

    composition2: {
      type: STRING,
      allowNull: true,
    },

    is_discontinued: {
      type: BOOLEAN,
      defaultValue: false,
    },

    description: {
      type: TEXT,
      allowNull: true,
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updatedAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["name"] },
      { fields: ["composition1"] },
      { fields: ["composition2"] },
      { fields: ["manufacturer"] },
      { fields: ["type"] },
      { fields: ["is_discontinued"] },
    ],
  },
);

module.exports = medicineSchema;
