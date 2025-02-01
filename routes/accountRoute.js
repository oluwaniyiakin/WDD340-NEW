const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation")

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
  
// Route for Login View
router.get("/login", accountController.buildLogin);

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});


router.get("/register", accountController.buildRegister);
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Render Registration Page
router.get('/register', (req, res) => {
    res.render('account/register');
});

// Render Login Page
router.get('/login', (req, res) => {
    res.render('account/login');
});

// Handle Registration (for now, just log the request)
router.post('/register', (req, res) => {
    console.log(req.body);
    res.send('Registration successful (backend validation needed)');
});

// Handle Login (for now, just log the request)
router.post('/login', (req, res) => {
    console.log(req.body);
    res.send('Login successful (backend validation needed)');
});

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send("login process");
    }
  );
  

module.exports = router;