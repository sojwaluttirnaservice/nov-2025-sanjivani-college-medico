const devAnalysedResult = {
  medicines: [
    {
      id: 1,
      name: "Medicine A",
      quantity: 2,
      frequency: "Twice daily",
      duration: null,
      confidence: 100,
      needs_verification: false
    },
    {
      id: 2,
      name: "Medicine B",
      quantity: 1,
      frequency: "Once daily",
      duration: null,
      confidence: 100,
      needs_verification: false
    },
    {
      id: 3,
      name: "Medicine C",
      quantity: 1,
      frequency: "Three times daily",
      duration: null,
      confidence: 100,
      needs_verification: false
    },
    {
      id: 4,
      name: "Oxprelol 50mg Tablet",
      quantity: 1,
      frequency: "QD",
      duration: null,
      confidence: 100,
      needs_verification: false
    }
  ],
  total_medicines: 4,
  average_confidence: 100,
  low_confidence_count: 0,
  needs_manual_review: false,
  analyzed_at: "2026-01-13T06:48:38.940Z",
  processing_time_ms: 8602
};


module.exports = {devAnalysedResult}