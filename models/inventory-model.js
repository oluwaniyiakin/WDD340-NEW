const pool = require('../database/'); // Database connection

const inventoryModel = {};

/* ***************************
 *  Get Inventory by Classification ID
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const sql = `
      SELECT * FROM inventory 
      WHERE classification_id = $1`;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error("Error in getInventoryByClassificationId:", error);
    throw error;
  }
};

/* ***************************
 *  Get Vehicle by Inventory ID
 * ************************** */
inventoryModel.getVehicleById = async function (invId) {
  try {
    const sql = `
      SELECT * FROM inventory 
      WHERE inv_id = $1`;
    const result = await pool.query(sql, [invId]);
    return result.rows[0]; // Return only the first matching vehicle
  } catch (error) {
    console.error("Error in getVehicleById:", error);
    throw error;
  }
};

module.exports = inventoryModel;
