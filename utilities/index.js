// utilities/index.js

// Define the Util object
const Util = {};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = ""; // Initialize grid to an empty string
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid +=
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
// Export the Util object
module.exports = Util;

function buildVehicleHTML(vehicle) {
    const price = vehicle.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const miles = vehicle.mileage.toLocaleString();
    return `
        <div class="vehicle-detail">
            <img src="${vehicle.full_image}" alt="Image of ${vehicle.make} ${vehicle.model}">
            <div>
                <h2>${vehicle.make} ${vehicle.model} (${vehicle.year})</h2>
                <p>Price: ${price}</p>
                <p>Mileage: ${miles} miles</p>
                <p>${vehicle.description}</p>
            </div>
        </div>
    `;
}

module.exports = { buildVehicleHTML };
