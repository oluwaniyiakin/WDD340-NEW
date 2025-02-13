const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const authMiddleware = require("../middleware/authMiddleware");

// Authentication & Account Management Routes
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

// Logout (Clears JWT & Session)
router.get("/logout", authMiddleware.ensureAuthenticated, accountController.logout);

// Account Management Routes (Protected)
router.get("/update/:id", authMiddleware.ensureAuthenticated, accountController.getUpdateView);
router.post(
  "/update",
  authMiddleware.ensureAuthenticated,
  regValidate.checkRegData,
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  "/update-password",
  authMiddleware.ensureAuthenticated,
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.updatePassword)
);

// Account Management Dashboard (Protected)
router.get("/", authMiddleware.ensureAuthenticated, accountController.buildManagement);

module.exports = router;
