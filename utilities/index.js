// Define the Util object
const Util = {};

// Build the classification view HTML
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

// Middleware for handling errors
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Define the getNav function for navigation
Util.getNav = async function() {
  return [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" }
  ];
};

// Wrap vehicle details in HTML for the detail view
Util.wrapVehicleHTML = (vehicle) => {
  // Format price and mileage
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD'
  }).format(vehicle.inv_price);

  const formattedMileage = vehicle.inv_mileage.toLocaleString();

  return `
    <div class="vehicle-details">
        <div class="vehicle-image">
            <img src="/images/vehicles/${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
        </div>
        <div class="vehicle-info">
            <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
            <p><strong>Price:</strong> ${formattedPrice}</p>
            <p><strong>Mileage:</strong> ${formattedMileage} miles</p>
            <p><strong>Color:</strong> ${vehicle.inv_color}</p>
            <p><strong>Fuel Type:</strong> ${vehicle.inv_fueltype}</p>
            <p><strong>Transmission:</strong> ${vehicle.inv_transmission}</p>
            <p><strong>Description:</strong> ${vehicle.inv_description || 'No description available.'}</p>
        </div>
    </div>
  `;
};

module.exports = Util;
