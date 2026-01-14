/**
 * Converts common medical frequency abbreviations into readable text
 * @private
 * @param {string|null} frequency
 * @returns {string|null}
 */
function normalizeFrequency(frequency) {
  if (!frequency || typeof frequency !== "string") return null;

  const normalized = frequency.trim().toUpperCase();

  const FREQUENCY_MAP = {
    OD: "Once daily",
    BID: "Twice daily",
    TID: "Three times daily",
    QID: "Four times daily",
  };

  // Exact abbreviation match
  if (FREQUENCY_MAP[normalized]) {
    return FREQUENCY_MAP[normalized];
  }

  // If AI already returned readable text, keep it as-is
  return frequency.trim();
}

/**
 * @fileoverview Gemini AI Service for Medical Prescription Analysis
 * @module services/geminiService
 * @description Provides secure, production-ready prescription analysis using Google's Gemini AI.
 * Supports both file paths and file objects from multer uploads.
 *
 * @requires dotenv - Environment variable management
 * @requires @google/generative-ai - Google Gemini AI SDK
 * @requires fs - File system operations
 * @requires path - File path utilities
 *
 * @author MedoPlus Team
 * @version 1.0.0
 * @since 2025-01-08
 */

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

/**
 * Allowed image file extensions for prescription uploads
 * @constant {string[]}
 */
const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
];

/**
 * MIME type mapping for image files
 * @constant {Object.<string, string>}
 */
const MIME_TYPE_MAP = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
};

/**
 * Maximum allowed file size (10MB)
 * @constant {number}
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Confidence thresholds for prescription analysis
 * @constant {Object}
 */
const CONFIDENCE_THRESHOLDS = {
  HIGH: 90, // Excellent clarity
  MEDIUM: 70, // Acceptable but needs verification
  LOW: 50, // Poor clarity, manual review required
};

/**
 * Gemini AI model configuration
 * @constant {Object}
 */
const GEMINI_CONFIG = {
  model: process.env.GEMINI_MODEL,
  generationConfig: {
    temperature: 0.2, // Lower temperature for consistent medical analysis
    topP: 0.8, // Nucleus sampling parameter
    topK: 40, // Top-k sampling parameter
  },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize Gemini AI with API key from environment
 * @throws {Error} If GEMINI_API_KEY is not set in environment variables
 */
if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not set in environment variables. Please check your .env file."
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validates if a file object is a proper multer file upload
 * @private
 * @param {Object} fileObj - File object to validate
 * @returns {boolean} True if valid multer file object
 */
function isValidFileObject(fileObj) {
  return (
    fileObj &&
    typeof fileObj === "object" &&
    (fileObj.path || fileObj.buffer) &&
    fileObj.mimetype
  );
}

/**
 * Validates if a file path string is safe and points to an existing file
 * @private
 * @param {string} filePath - File path to validate
 * @throws {Error} If file doesn't exist or has invalid extension
 * @returns {boolean} True if valid
 */
function validateFilePath(filePath) {
  // Security: Prevent path traversal attacks
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes("..")) {
    throw new Error("Invalid file path: Path traversal detected");
  }

  // Check file exists
  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`File not found: ${normalizedPath}`);
  }

  // Validate file extension
  const fileExtension = path.extname(normalizedPath).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension)) {
    throw new Error(
      `Invalid file type '${fileExtension}'. Allowed types: ${ALLOWED_IMAGE_EXTENSIONS.join(
        ", "
      )}`
    );
  }

  return true;
}

/**
 * Validates file size to prevent memory issues
 * @private
 * @param {Buffer} buffer - Image buffer to check
 * @throws {Error} If file size exceeds maximum
 * @returns {boolean} True if size is acceptable
 */
function validateFileSize(buffer) {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(
      `File size (${(buffer.length / 1024 / 1024).toFixed(
        2
      )}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`
    );
  }
  return true;
}

/**
 * Parses confidence value from various formats (number, string, percentage)
 * @private
 * @param {number|string} confidenceValue - Confidence value from AI
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Confidence score between 0-100
 */
function parseConfidence(confidenceValue, defaultValue = 75) {
  // If already a valid number
  if (typeof confidenceValue === "number") {
    return Math.max(0, Math.min(100, Math.round(confidenceValue)));
  }

  // If string (e.g., "75%" or "75")
  if (typeof confidenceValue === "string") {
    const numericValue = parseInt(confidenceValue.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(numericValue)) {
      return Math.max(0, Math.min(100, numericValue));
    }
  }

  // Return default if parsing failed
  return defaultValue;
}

/**
 * Cleans and extracts JSON from AI response text
 * @private
 * @param {string} text - Raw text response from AI
 * @returns {string} Cleaned JSON string
 * @throws {Error} If no valid JSON found
 */
function extractJsonFromResponse(text) {
  let cleanedText = text.trim();

  // Remove markdown code blocks
  cleanedText = cleanedText.replace(/```json\s*/g, "");
  cleanedText = cleanedText.replace(/```\s*/g, "");

  // Remove any leading explanatory text
  cleanedText = cleanedText.replace(/^[^{]*/, "");
  cleanedText = cleanedText.replace(/[^}]*$/, "");

  // Find JSON boundaries
  const jsonStart = cleanedText.indexOf("{");
  const jsonEnd = cleanedText.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
    throw new Error("No valid JSON found in AI response");
  }

  return cleanedText.substring(jsonStart, jsonEnd + 1).trim();
}

/**
 * Generates the AI prompt for prescription analysis
 * @private
 * @returns {string} Structured prompt for Gemini AI
 */
function generateAnalysisPrompt() {
  return `You are an expert medical prescription analyzer with years of experience in reading doctor's handwriting and medical prescriptions.

CRITICAL INSTRUCTIONS:
1. Extract EVERY medicine name with complete dosage/strength information (e.g., "Paracetamol 500mg", "Amoxicillin 250mg Capsule")
2. Extract the quantity prescribed for each medicine (if not clearly visible, use 1 as default)
3. Extract frequency/dosage instructions if visible (e.g., "1-0-1 after meals", "twice daily")
4. Extract duration if visible (e.g., "5 days", "1 week")
5. Estimate your confidence level (0-100) for each medicine based on image clarity
6. Extract patient name, doctor name, and prescription date if visible
7. Return ONLY valid JSON without any markdown formatting or explanations

CONFIDENCE SCORING GUIDELINES:
- 90-100: Medicine name is crystal clear, no ambiguity
- 70-89: Medicine name is readable but slightly unclear  
- 50-69: Medicine name is partially readable, some interpretation needed
- 30-49: Medicine name is very unclear, high uncertainty
- 0-29: Medicine name is barely visible, mostly guessed

OUTPUT FORMAT (strict JSON):
{
  "patient_name": "Full patient name or null if not visible",
  "doctor_name": "Full doctor name or null if not visible",
  "prescription_date": "Date in readable format or null if not visible",
  "medicines": [
    {
      "name": "Complete Medicine Name with Dosage (e.g., Paracetamol 500mg Tablet)",
      "quantity": number (positive integer),
      "frequency": "Dosage instructions or null",
      "duration": "Duration or null",
      "confidence": number between 0-100
    }
  ]
}

STRICT RULES:
- If prescription is completely blank/unreadable, return: {"patient_name": null, "doctor_name": null, "prescription_date": null, "medicines": []}
- Medicine names MUST include dosage information (e.g., "500mg", "10ml", "250mcg")
- Quantity must be a positive integer, never zero or negative
- Confidence must be a number between 0-100, NOT a string
- Do NOT add markdown code blocks or any explanatory text
- Return ONLY the JSON object, nothing else

Now analyze this prescription image:`;
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Analyzes a medical prescription image using Google Gemini AI
 *
 * @async
 * @function analyzePrescription
 * @param {string|Object} input - Either a file path (string) or multer file object
 * @param {string} [input.path] - File path (if multer file object)
 * @param {Buffer} [input.buffer] - File buffer (if multer memory storage)
 * @param {string} [input.mimetype] - MIME type of the file
 *
 * @returns {Promise<PrescriptionAnalysisResult>} Analyzed prescription data
 * @returns {boolean} returns.success - Whether analysis succeeded
 * @returns {string|null} returns.patient_name - Extracted patient name
 * @returns {string|null} returns.doctor_name - Extracted doctor name
 * @returns {string|null} returns.prescription_date - Extracted prescription date
 * @returns {Medicine[]} returns.medicines - Array of extracted medicines
 * @returns {number} returns.total_medicines - Total number of medicines found
 * @returns {number} returns.average_confidence - Average confidence across all medicines
 * @returns {number} returns.low_confidence_count - Count of medicines with confidence < 70
 * @returns {boolean} returns.needs_manual_review - Whether manual review is recommended
 * @returns {string} returns.analyzed_at - ISO timestamp of analysis
 *
 * @throws {Error} If input is invalid
 * @throws {Error} If file is not found or inaccessible
 * @throws {Error} If file size exceeds limit
 * @throws {Error} If Gemini API fails
 * @throws {Error} If response cannot be parsed
 *
 * @example
 * // Using file path
 * const result = await analyzePrescription('./uploads/prescription.jpg');
 *
 * @example
 * // Using multer file object
 * app.post('/upload', upload.single('prescription'), async (req, res) => {
 *   const result = await analyzePrescription(req.file);
 *   res.json(result);
 * });
 */
async function analyzePrescription(input) {
  let imagePath = null;
  let imageBuffer = null;
  let mimeType = null;

  try {
    // ========================================================================
    // STEP 1: INPUT VALIDATION & TYPE DETECTION
    // ========================================================================

    if (!input) {
      throw new Error("Input parameter is required");
    }

    // Handle FILE OBJECT (from multer)
    if (typeof input === "object" && input !== null) {
      console.log("📦 Processing file object from upload");

      if (!isValidFileObject(input)) {
        throw new Error(
          "Invalid file object: missing required properties (path/buffer and mimetype)"
        );
      }

      // Priority 1: Use file path if available (disk storage)
      if (input.path) {
        imagePath = input.path;
        validateFilePath(imagePath);
        console.log("📁 Reading from disk path:", imagePath);
        imageBuffer = fs.readFileSync(imagePath);
      }
      // Priority 2: Use buffer if available (memory storage)
      else if (input.buffer) {
        console.log("💾 Using in-memory buffer");
        imageBuffer = input.buffer;
      }

      mimeType = input.mimetype;
    }
    // Handle FILE PATH (string)
    else if (typeof input === "string") {
      console.log("📂 Processing file path");
      imagePath = input;
      validateFilePath(imagePath);

      console.log("📖 Reading file from:", imagePath);
      imageBuffer = fs.readFileSync(imagePath);

      // Determine MIME type from extension
      const fileExtension = path.extname(imagePath).toLowerCase();
      mimeType = MIME_TYPE_MAP[fileExtension] || "image/jpeg";
    } else {
      throw new Error(
        "Invalid input type: must be either a file path (string) or file object"
      );
    }

    // Validate file size
    validateFileSize(imageBuffer);

    console.log("🔍 Starting prescription analysis...");
    console.log(`📊 Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`🎨 MIME type: ${mimeType}`);

    // ========================================================================
    // STEP 2: PREPARE GEMINI AI MODEL
    // ========================================================================

    const model = genAI.getGenerativeModel(GEMINI_CONFIG);

    // Convert image to base64 for API
    const base64Image = imageBuffer.toString("base64");

    // ========================================================================
    // STEP 3: PREPARE AI REQUEST
    // ========================================================================

    const prompt = generateAnalysisPrompt();

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // ========================================================================
    // STEP 4: CALL GEMINI API
    // ========================================================================

    console.log("🤖 Calling Gemini AI API...");
    const startTime = Date.now();

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const rawText = response.text();

    const apiDuration = Date.now() - startTime;
    console.log(`⏱️  API response received in ${apiDuration}ms`);
    console.log("📥 Raw response preview:", rawText.substring(0, 150) + "...");

    // ========================================================================
    // STEP 5: PARSE AND VALIDATE RESPONSE
    // ========================================================================

    const cleanedJson = extractJsonFromResponse(rawText);

    let prescriptionData;
    try {
      prescriptionData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("❌ JSON parsing failed");
      console.error("Cleaned text:", cleanedJson);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

    // Validate response structure
    if (!prescriptionData || typeof prescriptionData !== "object") {
      throw new Error("AI response is not a valid object");
    }

    // Initialize medicines array if missing
    if (!Array.isArray(prescriptionData.medicines)) {
      console.warn(
        "⚠️  No medicines array in response, initializing empty array"
      );
      prescriptionData.medicines = [];
    }

    // ========================================================================
    // STEP 6: VALIDATE AND NORMALIZE MEDICINE DATA
    // ========================================================================

    prescriptionData.medicines = prescriptionData.medicines
      .filter((med) => {
        // Filter out invalid entries
        const isValid =
          med &&
          med.name &&
          typeof med.name === "string" &&
          med.name.trim().length > 0;

        if (!isValid) {
          console.warn("⚠️  Skipping invalid medicine entry:", med);
        }
        return isValid;
      })
      .map((med, index) => {
        // Parse and validate confidence
        const confidence = parseConfidence(med.confidence, 75);

        // Validate and normalize quantity
        let quantity = 1;
        if (typeof med.quantity === "number" && med.quantity > 0) {
          quantity = Math.round(med.quantity);
        } else if (typeof med.quantity === "string") {
          const parsed = parseInt(med.quantity, 10);
          if (!isNaN(parsed) && parsed > 0) {
            quantity = parsed;
          }
        }

        return {
          id: index + 1,
          name: med.name.trim(),
          quantity: quantity,
          frequency: normalizeFrequency(med.frequency),
          duration:
            med.duration && typeof med.duration === "string"
              ? med.duration.trim()
              : null,
          confidence: confidence,
          needs_verification: confidence < CONFIDENCE_THRESHOLDS.MEDIUM,
        };
      });

    // ========================================================================
    // STEP 7: CALCULATE AGGREGATE METRICS
    // ========================================================================

    const totalMedicines = prescriptionData.medicines.length;

    let averageConfidence = 0;
    let lowConfidenceCount = 0;

    if (totalMedicines > 0) {
      const totalConfidence = prescriptionData.medicines.reduce(
        (sum, med) => sum + med.confidence,
        0
      );
      averageConfidence = Math.round(totalConfidence / totalMedicines);

      lowConfidenceCount = prescriptionData.medicines.filter(
        (med) => med.confidence < CONFIDENCE_THRESHOLDS.MEDIUM
      ).length;
    }

    const needsManualReview =
      averageConfidence < CONFIDENCE_THRESHOLDS.MEDIUM ||
      lowConfidenceCount > 0;

    // ========================================================================
    // STEP 8: RETURN STRUCTURED RESULT
    // ========================================================================

    console.log(
      `✅ Analysis complete: ${totalMedicines} medicine(s) extracted`
    );
    console.log(`📊 Average confidence: ${averageConfidence}%`);
    if (needsManualReview) {
      console.log(
        `⚠️  Manual review recommended (${lowConfidenceCount} low-confidence items)`
      );
    }

    return {
      success: true,
      patient_name: prescriptionData.patient_name || null,
      doctor_name: prescriptionData.doctor_name || null,
      prescription_date: prescriptionData.prescription_date || null,
      medicines: prescriptionData.medicines,
      total_medicines: totalMedicines,
      average_confidence: averageConfidence,
      low_confidence_count: lowConfidenceCount,
      needs_manual_review: needsManualReview,
      analyzed_at: new Date().toISOString(),
      processing_time_ms: apiDuration,
    };
  } catch (error) {
    console.error("❌ Prescription analysis failed:", error.message);

    // ========================================================================
    // ERROR HANDLING WITH SPECIFIC MESSAGES
    // ========================================================================

    // API Key errors
    if (
      error.message?.includes("API key") ||
      error.message?.includes("API_KEY")
    ) {
      throw new Error(
        "Authentication failed: Invalid Gemini API key. Please verify GEMINI_API_KEY in your .env file"
      );
    }

    // Rate limit errors
    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit") ||
      error.message?.includes("429")
    ) {
      throw new Error(
        "Rate limit exceeded: Too many requests to Gemini API. Please try again in a few minutes"
      );
    }

    // Network errors
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error(
        "Network error: Unable to connect to Gemini API. Please check your internet connection"
      );
    }

    // File errors
    if (error.message?.includes("File not found") || error.code === "ENOENT") {
      throw new Error(`File error: ${error.message}`);
    }

    // For development: return mock data if enabled
    if (
      process.env.NODE_ENV === "DEV" &&
      process.env.USE_MOCK_DATA === "true"
    ) {
      console.warn("⚠️  Using mock data for development");
      return {
        success: true,
        patient_name: "John Doe",
        doctor_name: "Dr. Sarah Smith",
        prescription_date: "2025-01-08",
        medicines: [
          {
            id: 1,
            name: "Paracetamol 500mg Tablet",
            quantity: 10,
            frequency: "1-0-1 after meals",
            duration: "5 days",
            confidence: 95,
            needs_verification: false,
            available: true,
          },
          {
            id: 2,
            name: "Amoxicillin 250mg Capsule",
            quantity: 5,
            frequency: "1-1-1 before meals",
            duration: "3 days",
            confidence: 88,
            needs_verification: false,
            available: true,
          },
        ],
        total_medicines: 2,
        average_confidence: 91,
        low_confidence_count: 0,
        needs_manual_review: false,
        analyzed_at: new Date().toISOString(),
        processing_time_ms: 1500,
      };
    }

    if (error?.includes("503 Service Unavailable")) {
      throw new Error(`The service is having a load, try again.`);
    }

    // Re-throw the error with context
    throw new Error(`Prescription analysis failed: ${error.message}`);
  }
}

/**
 * Tests connection to Gemini AI API
 *
 * @async
 * @function testGeminiConnection
 * @returns {Promise<boolean>} True if API is accessible and working
 *
 * @example
 * const isWorking = await testGeminiConnection();
 * if (!isWorking) {
 *   console.error('Gemini API is not responding');
 * }
 */
async function testGeminiConnection() {
  try {
    console.log("🧪 Testing Gemini API connection...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      "Respond with exactly 'OK' if you receive this message."
    );

    const response = await result.response;
    const text = response.text();

    const isWorking = text && text.length > 0;
    console.log(
      isWorking ? "✅ API connection successful" : "❌ API connection failed"
    );

    return isWorking;
  } catch (error) {
    console.error("❌ Gemini API test failed:", error.message);
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * @typedef {Object} Medicine
 * @property {number} id - Unique identifier for the medicine
 * @property {string} name - Medicine name with dosage (e.g., "Paracetamol 500mg")
 * @property {number} quantity - Quantity prescribed
 * @property {string|null} frequency - Dosage instructions
 * @property {string|null} duration - Duration of treatment
 * @property {number} confidence - AI confidence score (0-100)
 * @property {boolean} needs_verification - Whether manual verification is needed
 * @property {boolean} available - Availability status (for pharmacy use)
 */

/**
 * @typedef {Object} PrescriptionAnalysisResult
 * @property {boolean} success - Whether analysis was successful
 * @property {string|null} patient_name - Extracted patient name
 * @property {string|null} doctor_name - Extracted doctor name
 * @property {string|null} prescription_date - Extracted prescription date
 * @property {Medicine[]} medicines - Array of extracted medicines
 * @property {number} total_medicines - Total number of medicines found
 * @property {number} average_confidence - Average confidence score
 * @property {number} low_confidence_count - Count of low-confidence medicines
 * @property {boolean} needs_manual_review - Whether manual review is recommended
 * @property {string} analyzed_at - ISO timestamp of analysis
 * @property {number} processing_time_ms - Time taken for API call in milliseconds
 */

module.exports = {
  analyzePrescription,
  testGeminiConnection,
  // Export constants for use in other modules
  CONFIDENCE_THRESHOLDS,
  ALLOWED_IMAGE_EXTENSIONS,
};
