const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Route to get all vehicles
router.get("/", vehicleController.getAllVehicles);

// Route to get a vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

module.exports = router;
