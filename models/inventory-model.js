const pool = require('../database'); // Database connection

const inventoryModel = {};

/* ***************************
 *  Get Inventory by Classification ID
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const sql = `
      SELECT 
        inv_id, make, model, year, price, mileage, image 
      FROM inventory 
      WHERE classification_id = $1;
    `;
    const result = await pool.query(sql, [classification_id]);
    return result.rows; // Return all inventory items for this classification
  } catch (error) {
    console.error("Error in getInventoryByClassificationId:", error);
    throw new Error('Error retrieving inventory by classification ID');
  }
};

/* ***************************
 *  Get Vehicle by Inventory ID
 * ************************** */
inventoryModel.getVehicleById = async function (invId) {
  try {
    const sql = `
      SELECT 
        inv_id, make, model, year, price, mileage, color, fuelType, transmission, image, description 
      FROM inventory 
      WHERE inv_id = $1;
    `;
    const result = await pool.query(sql, [invId]);

    if (result.rows.length === 0) {
      // No vehicle found
      throw new Error(`Vehicle with ID ${invId} not found`);
    }

    return result.rows[0]; // Return the first matching vehicle
  } catch (error) {
    console.error("Error in getVehicleById:", error);
    throw new Error('Error retrieving vehicle details');
  }
};

module.exports = inventoryModel;
