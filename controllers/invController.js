const pool = require("../database/");

async function getVehicleDetails(req, res) {
    const vehicleId = parseInt(req.params.id);

    try {
        // Fetch the requested vehicle
        const vehicleResult = await pool.query("SELECT * FROM vehicles WHERE inv_id = $1", [vehicleId]);

        // Fetch all vehicles for the sidebar
        const sidebarVehicles = await pool.query("SELECT inv_id, inv_make, inv_model, inv_price FROM vehicles ORDER BY inv_price DESC LIMIT 5");

        if (vehicleResult.rows.length > 0) {
            res.render("inventory/detail", {
                title: `${vehicleResult.rows[0].inv_make} ${vehicleResult.rows[0].inv_model} - CSE Motors`,
                vehicle: vehicleResult.rows[0],
                vehicles: sidebarVehicles.rows // Pass vehicles to EJS
            });
        } else {
            res.status(404).render("404", { title: "404 - Vehicle Not Found" });
        }
    } catch (error) {
        console.error("Error fetching vehicle details:", error);
        res.status(500).render("500", { title: "500 - Server Error" });
    }
}

module.exports = { getVehicleDetails };
