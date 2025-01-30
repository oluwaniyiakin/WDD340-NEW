// Define the Util object
const Util = {};

// Build the classification view HTML
Util.buildClassificationGrid = async function (data) {
  let grid = ""; // Initialize grid to an empty string
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
          </div>
        </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// Middleware for handling async errors
Util.handleErrors = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

// Define the getNav function for navigation
Util.getNav = async function () {
  return [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];
};

/**
 * Generate vehicle detail HTML
 * This function takes a vehicle object and returns an HTML string
 */
Util.buildVehicleDetailView = function (vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle details not available.</p>';
  }

  // Format price and mileage with commas
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price);

  const formattedMileage = new Intl.NumberFormat("en-US").format(vehicle.inv_mileage);

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-images">
        <img src="/images/vehicles/${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Price:</strong> ${formattedPrice}</p>
        <p><strong>Mileage:</strong> ${formattedMileage} miles</p>
        <p><strong>Exterior Color:</strong> ${vehicle.inv_extcolor || "Not specified"}</p>
        <p><strong>Interior Color:</strong> ${vehicle.inv_intcolor || "Not specified"}</p>
        <p><strong>Fuel Type:</strong> ${vehicle.inv_fueltype || "Not specified"}</p>
        <p><strong>Drivetrain:</strong> ${vehicle.inv_drivetrain || "Not specified"}</p>
        <p><strong>Transmission:</strong> ${vehicle.inv_transmission || "Not specified"}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description || "No description available."}</p>

        <div class="button-container">
          <button>Start My Purchase</button>
          <button>Contact Us</button>
          <button>Schedule Test Drive</button>
          <button>Apply for Financing</button>
        </div>
      </div>
    </div>
  `;
};

module.exports = Util;
