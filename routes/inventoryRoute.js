const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities"); 
const invValidate = require("../utilities/inventory-validation");
const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware"); // Fixed import

// Protect inventory management routes
router.get("/manage", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.showManagementView));
router.post("/add", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.addInventory));
router.post("/edit/:id", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.updateInventory));
router.post("/delete/:id", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.deleteVehicle));

// Get Inventory by Classification (JSON response)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Classification Routes
router.get("/add-classification", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.addClassification));

// Inventory Routes
router.get("/add-inventory", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.addInventory));

// Route to display the Edit Inventory page
router.get("/edit/:inv_id", authenticateToken, authorizeAdmin, utilities.handleErrors(invController.editInventoryView));

// Update Inventory Route
router.post("/update", authenticateToken, authorizeAdmin, invValidate.newInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

module.exports = router;
