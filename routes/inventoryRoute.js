// Needed Resources
const express = require("express"); // Import Express
const router = new express.Router(); // Create a new router object
const invController = require("../controllers/invController"); // Import the inventory controller (will be implemented later)

// Export the router so it can be used in other parts of the app
module.exports = router;
