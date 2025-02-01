const getVehicleById = async (req, res) => {
  try {
      const vehicleId = req.params.id;
      const vehicle = await inventoryModel.getVehicleById(vehicleId);

      if (!vehicle) {
          return res.status(404).render("error", { message: "Vehicle not found" });
      }

      // Fetch all vehicles for the sidebar
      const vehicles = await inventoryModel.getAllVehicles();

      res.render("detail", { vehicle, vehicles, title: `${vehicle.inv_make} ${vehicle.inv_model}` });
  } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).render("error", { message: "Internal Server Error" });
  }
};

const utilities = require("../utilities");

async function showManagementView(req, res) {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash()
    });
}

const invModel = require("../models/inventory-model");

async function buildAddClassification(req, res) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        messages: req.flash()
    });
}

async function addClassification(req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    
    if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
        req.flash("notice", "Invalid classification name. Only letters and numbers allowed.");
        return res.redirect("/inv/add-classification");
    }

    const result = await invModel.addClassification(classification_name);

    if (result) {
        req.flash("notice", `Classification "${classification_name}" added successfully.`);
        res.redirect("/inv/");
    } else {
        req.flash("notice", "Failed to add classification.");
        res.redirect("/inv/add-classification");
    }
}

module.exports = { showManagementView, buildAddClassification, addClassification };

async function buildAddInventory(req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      messages: req.flash()
  });
}

async function addInventory(req, res) {
  let nav = await utilities.getNav();
  const { classification_id, inv_make, inv_model, inv_year } = req.body;

  if (!classification_id || !inv_make || !inv_model || !inv_year) {
      req.flash("notice", "All fields are required.");
      return res.redirect("/inv/add-inventory");
  }

  const result = await invModel.addVehicle(classification_id, inv_make, inv_model, inv_year);

  if (result) {
      req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`);
      res.redirect("/inv/");
  } else {
      req.flash("notice", "Failed to add vehicle.");
      res.redirect("/inv/add-inventory");
  }
}

module.exports = { buildAddInventory, addInventory };

