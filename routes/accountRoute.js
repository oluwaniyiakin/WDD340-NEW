const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Routes for authentication and account management
router.get("/login", accountController.buildLogin); // Login View
router.get("/register", accountController.buildRegister); // Registration View

// Process Login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process Registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Logout
router.get("/logout", accountController.logout);

// Routes for account updates (Ensure user is authenticated)
router.get("/update/:id", utilities.checkAuth, accountController.getUpdateView);
router.post(
  "/update",
  utilities.checkAuth,
  regValidate.checkRegData, // Use existing validation function or create a new one for updates
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  "/update-password",
  utilities.checkAuth,
  regValidate.checkLoginData, // Use existing validation function or create one for password update
  utilities.handleErrors(accountController.updatePassword)
);

// Account management dashboard (protected route)
router.get("/", utilities.checkAuth, accountController.buildManagement);

module.exports = router;
