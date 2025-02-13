const utilities = require("../utilities");  
const invModel = require("../models/inventory-model");

/* ****************************************
 * Show Inventory Management View
 * **************************************** */
async function showManagementView(req, res) {
    try {
        let nav = await utilities.getNav();
        let classificationSelect = await utilities.buildClassificationList();
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            classificationSelect,
            messages: req.flash(),
        });
    } catch (error) {
        console.error("Error rendering management view:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Fetch All Inventory Items
 * **************************************** */
async function getInventory(req, res) {
    try {
        const inventory = await invModel.getAllInventory(); // Ensure this function exists in your model
        res.render("inventory/list", { title: "Inventory", inventory });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Build Add Classification Page
 * **************************************** */
async function buildAddClassification(req, res) {
    try {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            messages: req.flash(),
        });
    } catch (error) {
        console.error("Error rendering add classification page:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Add Classification (POST)
 * **************************************** */
async function addClassification(req, res) {
    try {
        let nav = await utilities.getNav();
        const { classification_name } = req.body;

        if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
            req.flash("notice", "Invalid classification name. Only letters and numbers allowed.");
            return res.redirect("/inventory/add-classification");
        }

        const result = await invModel.addClassification(classification_name);
        
        req.flash("notice", result ? `Classification "${classification_name}" added successfully.` : "Failed to add classification.");
        res.redirect(result ? "/inventory/" : "/inventory/add-classification");
    } catch (error) {
        console.error("Error adding classification:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Return Inventory by Classification As JSON
 * **************************************** */
async function getInventoryJSON(req, res, next) {
    try {
        const classification_id = parseInt(req.params.classification_id);
        const invData = await invModel.getInventoryByClassificationId(classification_id);
        res.status(invData.length > 0 ? 200 : 404).json(invData.length > 0 ? invData : { message: "No inventory found for this classification" });
    } catch (error) {
        console.error("Error fetching inventory JSON:", error);
        next(error);
    }
}

/* ****************************************
 * Build Add Inventory Page
 * **************************************** */
async function buildAddInventory(req, res) {
    try {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList();
        res.render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            classificationList,
            messages: req.flash(),
        });
    } catch (error) {
        console.error("Error rendering add inventory page:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Add Inventory (POST)
 * **************************************** */
async function addInventory(req, res) {
    try {
        let nav = await utilities.getNav();
        const { classification_id, inv_make, inv_model, inv_year } = req.body;

        if (!classification_id || !inv_make || !inv_model || !inv_year) {
            req.flash("notice", "All fields are required.");
            return res.redirect("/inventory/add-inventory");
        }

        const result = await invModel.addVehicle(classification_id, inv_make, inv_model, inv_year);
        
        req.flash("notice", result ? `Vehicle ${inv_make} ${inv_model} added successfully.` : "Failed to add vehicle.");
        res.redirect(result ? "/inventory/" : "/inventory/add-inventory");
    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Get Vehicle by ID (Detail Page)
 * **************************************** */
async function getVehicleById(req, res) {
    try {
        const vehicleId = req.params.id;
        const vehicle = await invModel.getVehicleById(vehicleId);
        if (!vehicle) return res.status(404).render("error", { message: "Vehicle not found" });
        const vehicles = await invModel.getAllVehicles();
        res.render("inventory/detail", { title: `${vehicle.inv_make} ${vehicle.inv_model}`, vehicle, vehicles });
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
async function editInventoryView(req, res) {
    try {
        const inv_id = parseInt(req.params.inv_id);
        let nav = await utilities.getNav();
        const itemData = await invModel.getInventoryById(inv_id);
        if (!itemData) return res.redirect("/inventory").flash("error", "Vehicle not found.");
        const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
        res.render("inventory/edit-inventory", { title: "Edit " + itemData.inv_make + " " + itemData.inv_model, nav, classificationSelect, errors: null, ...itemData });
    } catch (error) {
        console.error("Error loading edit inventory page:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(req, res) {
    try {
        let nav = await utilities.getNav();
        const updateResult = await invModel.updateInventory(req.body);
        if (updateResult) {
            req.flash("notice", `The ${req.body.inv_make} ${req.body.inv_model} was successfully updated.`);
            return res.redirect("/inventory/");
        }
        req.flash("notice", "Sorry, the update failed.");
        res.render("inventory/edit-inventory", { title: "Edit " + req.body.inv_make + " " + req.body.inv_model, nav, classificationSelect: await utilities.buildClassificationList(req.body.classification_id), errors: null, ...req.body });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}
async function deleteVehicle(req, res, next) {
    try {
        const vehicleId = req.params.id;

        // Call model function to delete vehicle from database
        const result = await inventoryModel.deleteVehicleById(vehicleId);

        if (result.rowCount === 0) {
            req.flash("error", "Vehicle not found or already deleted.");
            return res.redirect("/inventory/manage");
        }

        req.flash("success", "Vehicle deleted successfully.");
        res.redirect("/inventory/manage");
    } catch (error) {
        next(error); // Pass error to middleware
    }
}

/* ****************************************
 * Export all functions
 * **************************************** */
module.exports = {
    getInventory,
    showManagementView,
    addInventory,
    updateInventory,
    deleteVehicle,
    buildAddClassification,
    addClassification,
    buildAddInventory,
    getInventoryJSON,
    getVehicleById,
    editInventoryView,
};
