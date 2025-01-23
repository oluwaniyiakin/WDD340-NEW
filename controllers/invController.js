const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (data.length > 0) {
      const grid = await utilities.buildClassificationGrid(data);
      const nav = await utilities.getNav();
      const className = data[0].classification_name;
      res.render("./inventory/classification", {
        title: `${className} Vehicles`,
        nav,
        grid,
      });
    } else {
      next(); // Pass to 404 handler if no data found
    }
  } catch (error) {
    next(error); // Handle other errors
  }
};

/* ***************************
 *  Get vehicle details by inventory ID
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  const invId = req.params.inv_id; // Get inventory ID from route parameters
  try {
    const vehicleData = await invModel.getVehicleById(invId); // Fetch vehicle details
    if (vehicleData) {
      const viewHTML = utilities.buildVehicleHTML(vehicleData); // Generate HTML for vehicle
      const nav = await utilities.getNav();
      res.render("./inventory/vehicle-detail", {
        title: `${vehicleData.make} ${vehicleData.model}`,
        nav,
        viewHTML,
      });
    } else {
      next(); // Pass to 404 handler if not found
    }
  } catch (error) {
    next(error); // Handle other errors
  }
};

module.exports = invCont;
