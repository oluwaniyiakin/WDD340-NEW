const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


module.exports = invCont

const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities/');

// Controller function to get vehicle detail
async function getVehicleDetail(req, res, next) {
    const invId = req.params.inv_id;
    try {
        const vehicleData = await inventoryModel.getVehicleById(invId); // Calls the model
        if (vehicleData) {
            const viewHTML = utilities.buildVehicleHTML(vehicleData); // Formats HTML
            res.render('inventory/vehicle-detail', { 
                title: `${vehicleData.make} ${vehicleData.model}`,
                viewHTML,
            });
        } else {
            next(); // Pass to 404 handler if not found
        }
    } catch (error) {
        next(error); // Handle other errors
    }
}

module.exports = { getVehicleDetail };
