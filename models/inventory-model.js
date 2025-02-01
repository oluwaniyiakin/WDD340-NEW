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

module.exports = { getVehicleById, addClassification, addVehicle };
