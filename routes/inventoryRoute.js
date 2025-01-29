const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/detail/:id', inventoryController.vehicleDetail);

module.exports = router;
