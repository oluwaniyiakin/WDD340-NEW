const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Inventory Management View
router.get("/", invController.showManagementView);

// Classification Routes
router
    .route("/add-classification")
    .get(invController.buildAddClassification)
    .post(invController.addClassification);

// Inventory Routes
router
    .route("/add-inventory")
    .get(invController.buildAddInventory)
    .post(invController.addInventory);

module.exports = router;

