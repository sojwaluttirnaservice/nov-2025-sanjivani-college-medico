const { INTEGER, TEXT, DATE, BOOLEAN, STRING, FLOAT } = require("sequelize");
const sequelize = require("../config/sequelize");
const Prescription = require("./prescriptions");

const prescriptionAnalysisSchema = sequelize.define(
  "prescription_analysis",
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    prescription_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: Prescription,
        key: "id",
      },
    },

    extracted_text: {
      type: TEXT,
      allowNull: true,
      comment: "Raw text extracted from prescription image/PDF",
    },

    structured_data: {
      type: TEXT, // JSON string
      allowNull: true,
      comment: "Structured medicine data extracted by LLM",
    },

    confidence_score: {
      type: FLOAT,
      allowNull: true,
      comment: "LLM confidence score (0–1)",
    },

    model_used: {
      type: STRING,
      allowNull: true,
      comment: "LLM model/version used for analysis",
    },

    status: {
      type: STRING,
      defaultValue: "completed",
      comment: "completed | failed | pending",
    },

    error_message: {
      type: TEXT,
      allowNull: true,
      comment: "Error message if analysis failed",
    },

    createdAt: {
      type: DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

prescriptionAnalysisSchema.belongsTo(Prescription, {
  foreignKey: "prescription_id",
  as: "prescription",
});

module.exports = prescriptionAnalysisSchema;
