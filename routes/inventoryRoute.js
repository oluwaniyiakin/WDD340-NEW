const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");
const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware");

console.log("Inventory Controller Keys:", Object.keys(invController)); // Debugging line

// 🔹 Inventory Management
router.get("/manage", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.showManagementView));

// 🔹 Classification Routes
router.get("/add-classification", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.addClassification));

// 🔹 Inventory Routes
router.get("/add-inventory", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.addInventory));

// 🔹 Get Inventory by Classification (JSON)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// 🔹 Vehicle Detail Page
router.get("/detail/:id", utilities.handleErrors(invController.getVehicleById));

// 🔹 Edit Inventory Routes
router.get("/edit/:inv_id", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.editInventoryView));
router.post(
    "/update",
    authenticateToken,
    authorizeAdmin,
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// 🔹 Delete Vehicle Route
router.post("/delete/:id", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.deleteVehicle));

module.exports = router;
