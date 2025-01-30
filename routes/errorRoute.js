const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Define the route to trigger an error (500 status)
router.get("/500", (req, res, next) => {
    const error = new Error("Intentional Error!");
    error.status = 500;
    next(error); // Pass the error to the error handling middleware
});

// Define another route for triggering an error using the controller
router.get("/", errorController.triggerError);

module.exports = router;
