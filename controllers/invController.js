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

        if (result) {
            req.flash("notice", `Classification "${classification_name}" added successfully.`);
            res.redirect("/inventory/");
        } else {
            req.flash("notice", "Failed to add classification.");
            res.redirect("/inventory/add-classification");
        }
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

        if (invData.length > 0) {
            return res.json(invData);
        } else {
            return res.status(404).json({ message: "No inventory found for this classification" });
        }
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

        if (result) {
            req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`);
            res.redirect("/inventory/");
        } else {
            req.flash("notice", "Failed to add vehicle.");
            res.redirect("/inventory/add-inventory");
        }
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

        if (!vehicle) {
            return res.status(404).render("error", { message: "Vehicle not found" });
        }

        // Fetch all vehicles for the sidebar
        const vehicles = await invModel.getAllVehicles();

        res.render("inventory/detail", {
            title: `${vehicle.inv_make} ${vehicle.inv_model}`,
            vehicle,
            vehicles,
        });
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
async function editInventoryView(req, res, next) {
    try {
        const inv_id = parseInt(req.params.inv_id);
        let nav = await utilities.getNav();

        // Get item data from the database
        const itemData = await invModel.getInventoryById(inv_id);

        if (!itemData) {
            req.flash("error", "Vehicle not found.");
            return res.redirect("/inventory");
        }

        // Build classification dropdown with pre-selected value
        const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors: null,
            ...itemData, // Spread all itemData properties
        });
    } catch (error) {
        console.error("Error loading edit inventory page:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body;

        const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id);

        if (updateResult) {
            req.flash("notice", `The ${inv_make} ${inv_model} was successfully updated.`);
            res.redirect("/inventory/");
        } else {
            const classificationSelect = await utilities.buildClassificationList(classification_id);
            req.flash("notice", "Sorry, the update failed.");
            res.status(501).render("inventory/edit-inventory", {
                title: "Edit " + inv_make + " " + inv_model,
                nav,
                classificationSelect,
                errors: null,
                inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
            });
        }
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

/* ****************************************
 * Export all functions
 * **************************************** */
module.exports = {
    showManagementView,
    buildAddClassification,
    addClassification,
    getInventoryJSON,
    buildAddInventory,
    addInventory,
    getVehicleById,
    editInventoryView,
    updateInventory, // Now correct
};
