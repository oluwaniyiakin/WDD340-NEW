const vehicleModel = require("../models/vehicleModel");

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleModel.getAllVehicles();
        res.render("vehicles/index", { title: "All Vehicles", vehicles });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).render("errors/500", { title: "Server Error", message: error.message });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await vehicleModel.getVehicleById(req.params.id);
        if (!vehicle) {
            return res.status(404).render("errors/404", { title: "Vehicle Not Found" });
        }
        res.render("vehicles/detail", { title: `${vehicle.make} ${vehicle.model}`, vehicle });
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).render("errors/500", { title: "Server Error", message: error.message });
    }
};
