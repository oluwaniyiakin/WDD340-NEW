const invModel = require('../models/inventory-model');
const utilities = require('../utilities/index');

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
      res.render('./inventory/classification', {
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
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const vehicleId = req.params.vehicleId; // Get vehicle ID from the route
  try {
    const vehicleData = await invModel.getVehicleById(vehicleId); // Fetch vehicle data

    if (!vehicleData) {
      const error = new Error('Vehicle not found');
      error.status = 404;
      return next(error);
    }

    const vehicleHTML = utilities.wrapVehicleHTML(vehicleData); // Generate HTML for the vehicle
    const nav = await utilities.getNav();

    res.render('./inventory/vehicle-detail', {
      title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
      nav,
      content: vehicleHTML, // Deliver the vehicle content
    });
  } catch (error) {
    next(error); // Pass error to error handler
  }
};

module.exports = invCont;
