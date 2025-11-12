const { getPool } = require('../database');

/**
 * Generate next sequential document number
 * @param {string} prefix - Document prefix (e.g., 'ชร', 'ทว', etc.)
 * @param {number} year - Year in Buddhist calendar (e.g., 2568)
 * @returns {Promise<string>} Formatted document number (e.g., 'ชร. 0001/2568')
 */
async function generateDocumentNumber(prefix = 'ชร', year = null) {
  const pool = getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get current year if not provided
    if (!year) {
      const currentDate = new Date();
      year = currentDate.getFullYear() + 543; // Convert to Buddhist calendar
    }
    
    // Lock the row for update
    const [rows] = await connection.execute(
      `SELECT id, last_number FROM document_numbers 
       WHERE prefix = ? AND year = ? 
       FOR UPDATE`,
      [prefix, year]
    );
    
    let newNumber;
    
    if (rows.length === 0) {
      // First document for this prefix/year
      await connection.execute(
        `INSERT INTO document_numbers (prefix, year, last_number) 
         VALUES (?, ?, 1)`,
        [prefix, year]
      );
      newNumber = 1;
    } else {
      // Increment and update
      newNumber = rows[0].last_number + 1;
      await connection.execute(
        `UPDATE document_numbers 
         SET last_number = ?, updated_at = NOW() 
         WHERE id = ?`,
        [newNumber, rows[0].id]
      );
    }
    
    await connection.commit();
    
    // Format: ชร. 0001/2568
    const formattedNumber = `${prefix}. ${String(newNumber).padStart(4, '0')}/${year}`;
    
    console.log(`📄 Generated document number: ${formattedNumber}`);
    
    return formattedNumber;
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error generating document number:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get current document number (without incrementing)
 * @param {string} prefix - Document prefix
 * @param {number} year - Year in Buddhist calendar
 * @returns {Promise<string>} Current document number
 */
async function getCurrentDocumentNumber(prefix = 'ชร', year = null) {
  try {
    const pool = getPool();
    
    if (!year) {
      const currentDate = new Date();
      year = currentDate.getFullYear() + 543;
    }
    
    const [rows] = await pool.execute(
      `SELECT last_number FROM document_numbers 
       WHERE prefix = ? AND year = ?`,
      [prefix, year]
    );
    
    if (rows.length === 0) {
      return `${prefix}. 0000/${year}`;
    }
    
    const lastNumber = rows[0].last_number;
    return `${prefix}. ${String(lastNumber).padStart(4, '0')}/${year}`;
    
  } catch (error) {
    console.error('❌ Error getting current document number:', error);
    throw error;
  }
}

module.exports = {
  generateDocumentNumber,
  getCurrentDocumentNumber
};

