const pool = require("../database/");

// Get a vehicle by its ID
const getVehicleById = async (id) => {
    try {
        const query = "SELECT * FROM inventory WHERE inv_id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0]; // Return single vehicle
    } catch (error) {
        console.error("Error fetching vehicle by ID:", error);
        return null;
    }
};
async function getInventoryByClassificationId(classification_id) {
    try {
      const sql = "SELECT * FROM inventory WHERE classification_id = $1";
      const result = await pool.query(sql, [classification_id]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  }
  

// Add a new classification
const addClassification = async (classification_name) => {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
        const result = await pool.query(sql, [classification_name]);
        return result.rowCount;
    } catch (error) {
        console.error("Error adding classification:", error);
        return null;
    }
};

// Add a new vehicle to inventory
const addVehicle = async (classification_id, inv_make, inv_model, inv_year) => {
    try {
        const sql = `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year)
                     VALUES ($1, $2, $3, $4)`;
        const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year]);
        return result.rowCount;
    } catch (error) {
        console.error("Error adding vehicle:", error);
        return null;
    }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
    try {
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
        const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id]);
        return data.rows[0];
    } catch (error) {
        console.error("model error: " + error);
    }
}

module.exports = { getVehicleById, addClassification, addVehicle };
