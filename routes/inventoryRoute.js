const express = require("express"); 
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Inventory Management View
router.get("/", invController.showManagementView);

// Classification Routes
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

// Inventory Routes
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

module.exports = router;
