const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities"); // Ensure this is correctly imported
const { newInventoryRules, checkUpdateData } = require("../utilities/inventory-validation");
const { authenticateToken, authorizeAdmin } = require("../middleware/authMiddleware.");

// Protect inventory management routes
router.get("/manage", authenticateToken, authorizeAdmin, invController.showInventoryManagement);
router.post("/add", authenticateToken, authorizeAdmin, invController.addVehicle);
router.post("/edit/:id", authenticateToken, authorizeAdmin, invController.editVehicle);
router.post("/delete/:id", authenticateToken, authorizeAdmin, invController.deleteVehicle);


router.post("/update", invController.updateInventory);

router.post("/update/", newInventoryRules(), checkUpdateData, invController.updateInventory);

// Inventory Management View
router.get("/", utilities.handleErrors(invController.showManagementView));

// Get Inventory by Classification (JSON response)
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

// Classification Routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Inventory Routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Route to display the Edit Inventory page
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

router.post("/update/", invValidate.newInventoryRules(), invValidate.checkUpdateData, invController.updateInventory)


module.exports = router;
