const utilities = require("../utilities");
const invModel = require("../models/inventory-model");

// Show Inventory Management View
async function showManagementView(req, res) {
    try {
        let nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            messages: req.flash(),
        });
    } catch (error) {
        console.error("Error rendering management view:", error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
}

// Build Add Classification Page
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

// Add Classification (Post Request)
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

// Build Add Inventory Page
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

// Add Inventory (Post Request)
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

// Get Vehicle by ID (Detail Page)
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

// Export all functions
module.exports = {
    showManagementView,
    buildAddClassification,
    addClassification,
    buildAddInventory,
    addInventory,
    getVehicleById
};
