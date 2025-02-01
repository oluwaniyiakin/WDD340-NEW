const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

router.get("/", invController.showManagementView);

router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);


module.exports = router;
