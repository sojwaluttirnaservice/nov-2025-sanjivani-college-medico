const { query } = require("../utils/query/query");

const pharmaciesModel = {
  /**
   * Check if pharmacy exists for a given user
   */
  checkByUserId: (userId) => {
    const q = `
            SELECT
                id AS pharmacy_id,
                user_id,
                pharmacy_name,
                license_no,
                contact_no,
                is_verified
            FROM pharmacies
            WHERE user_id = ?
            LIMIT 1
        `;
    return query(q, [userId]);
  },

  /**
   * Create new pharmacy
   */
  create: (data) => {
    const q = `
            INSERT INTO pharmacies (
                user_id,
                pharmacy_name,
                license_no,
                contact_no,
                address,
                city,
                pincode
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    return query(q, [
      data.user_id,
      data.pharmacy_name,
      data.license_no,
      data.contact_no,
      data.address,
      data.city || null,
      data.pincode || null,
    ]);
  },

  /**
   * Update pharmacy by user_id
   */
  updateByUserId: (userId, data) => {
    const q = `
            UPDATE pharmacies
            SET
                pharmacy_name = ?,
                license_no = ?,
                contact_no = ?,
                address = ?,
                city = ?,
                pincode = ?
            WHERE user_id = ?
        `;
    return query(q, [
      data.pharmacy_name,
      data.license_no,
      data.contact_no,
      data.address,
      data.city || null,
      data.pincode || null,
      userId,
    ]);
  },

  /**
   * Get pharmacy by pharmacy ID
   */
  getById: (pharmacyId) => {
    const q = `
            SELECT *
            FROM pharmacies
            WHERE id = ?
            LIMIT 1
        `;
    return query(q, [pharmacyId]);
  },

  /**
   * Get pharmacy with linked user info
   */
  getWithUser: (userId) => {
    const q = `
            SELECT
                p.id AS pharmacy_id,
                p.pharmacy_name,
                p.license_no,
                p.contact_no,
                p.address,
                p.city,
                p.pincode,
                p.is_verified,
                u.id AS user_id,
                u.email,
                u.role
            FROM pharmacies p
            INNER JOIN users u ON u.id = p.user_id
            WHERE p.user_id = ?
            LIMIT 1
        `;
    return query(q, [userId]);
  },

  /**
   * Verify pharmacy (admin action)
   */
  verifyById: (pharmacyId) => {
    const q = `
            UPDATE pharmacies
            SET is_verified = 1
            WHERE id = ?
        `;
    return query(q, [pharmacyId]);
  },

  /**
   * Delete pharmacy (rare, admin use)
   */
  deleteByUserId: (userId) => {
    const q = `
            DELETE FROM pharmacies
            WHERE user_id = ?
        `;
    return query(q, [userId]);
  },

  /**
   * Get all verified pharmacies
   * @param {string} searchQuery - Optional search term
   */
  /**
   * Get all verified pharmacies with Intelligent Ranking
   *
   * SENIOR DEV IMPLEMENTATION NOTE:
   * We intentionally avoid strict WHERE clauses for City/Pincode to prevent zero results on typos.
   * Instead, we use a weighted ORDER BY ranking system:
   * 1. Search Query Match (Name/Address) - Highest Priority (User Intent)
   * 2. Exact City + Pincode - Perfect Location Match
   * 3. City Match Only - Handles "Wrong/Typo Pincode" scenario (High Priority)
   * 4. Pincode Match Only - Handles "Wrong City Name" scenario
   * 5. Fallback - Returns other verified pharmacies so list is never empty.
   */
  getAll: (searchQuery = "", city = "", pincode = "") => {
    let q = `
            SELECT
                p.id AS pharmacy_id,
                p.pharmacy_name,
                p.license_no,
                p.contact_no,
                p.address,
                p.city,
                p.pincode,
                p.is_verified,
                u.email
            FROM pharmacies p
            INNER JOIN users u ON u.id = p.user_id
            -- NOTE: Verification workflow is not implemented yet.
            -- We ignore p.is_verified flag in the current context.
            -- WHERE p.is_verified = 1
        `;

    const params = [];

    // STRICT Search Filter (only if user explicitly searches name/city)
    // We removed strict city-only filtering to allow fallback results.
    // Old filter removed. Logic moved to ORDER BY.

    const search = searchQuery ? searchQuery.trim() : "";
    const cleanCity = city ? city.trim() : "";
    const cleanPincode = pincode ? pincode.trim() : "";

    q += ` ORDER BY 
            CASE 
                -- 0. Search Query Matches Name or Address (Specific Intent)
                WHEN (? <> '' AND (LOWER(p.pharmacy_name) LIKE LOWER(?) OR LOWER(p.address) LIKE LOWER(?))) THEN 0

                -- 1. Exact Match: City AND Pincode (Best Location)
                WHEN (LOWER(p.city) = LOWER(?) AND p.pincode = ?) THEN 1
                
                -- 2. City Match
                WHEN LOWER(p.city) = LOWER(?) THEN 2

                -- 3. Pincode Match (Handles city typos)
                WHEN p.pincode = ? THEN 3
                
                -- 4. Fallback (Anything else verified)
                ELSE 4
            END,
            p.pharmacy_name ASC
            LIMIT 50`;

    // Params: search, name, address, city, pin, city, pin
    params.push(
      search,
      `%${search}%`,
      `%${search}%`,
      cleanCity,
      cleanPincode,
      cleanCity,
      cleanPincode,
    );

    return query(q, params);
  },
};

module.exports = pharmaciesModel;
