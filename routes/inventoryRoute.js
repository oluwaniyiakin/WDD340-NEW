const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to handle vehicle detail view
router.get('/vehicle/:vehicleId', inventoryController.buildVehicleDetail);

module.exports = router;
