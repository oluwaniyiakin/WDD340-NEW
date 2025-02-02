const pool = require("../database"); // PostgreSQL database connection

// Get all vehicles from the database
async function getAllVehicles() {
    try {
        const result = await pool.query("SELECT * FROM vehicles ORDER BY inv_make, inv_model ASC");
        return result.rows;
    } catch (error) {
        console.error("Database error fetching vehicles:", error);
        throw error;
    }
}

// Get a single vehicle by ID
async function getVehicleById(id) {
    try {
        const result = await pool.query("SELECT * FROM vehicles WHERE inv_id = $1", [id]);
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("Database error fetching vehicle by ID:", error);
        throw error;
    }
}

module.exports = { getAllVehicles, getVehicleById };
