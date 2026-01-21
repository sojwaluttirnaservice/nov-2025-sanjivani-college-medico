const { query } = require("../utils/query/query");

const prescriptionAnalysisModel = {
  create: (data) => {
    const q = `
      INSERT INTO prescription_analysis (
        prescription_id,
        extracted_text,
        structured_data,
        confidence_score,
        model_used,
        status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    return query(q, [
      data.prescription_id,
      data.extracted_text || null,
      JSON.stringify(data.structured_data || {}),
      data.confidence_score || null,
      data.model_used,
      data.status || "completed",
    ]);
  },

  getLatestByPrescriptionId: (prescriptionId) => {
    return query(
      `
      SELECT *
      FROM prescription_analysis
      WHERE prescription_id = ?
      ORDER BY createdAt DESC
      LIMIT 1
      `,
      [prescriptionId],
    );
  },

  getAllByPrescriptionId: (prescriptionId) => {
    return query(
      `
      SELECT *
      FROM prescription_analysis
      WHERE prescription_id = ?
      ORDER BY createdAt DESC
      `,
      [prescriptionId],
    );
  },

  markFailed: (prescriptionId, error) => {
    return query(
      `
      INSERT INTO prescription_analysis (
        prescription_id,
        status,
        error_message,
        model_used
      ) VALUES (?, 'failed', ?, 'unknown')
      `,
      [prescriptionId, error],
    );
  },
};

module.exports = prescriptionAnalysisModel;
