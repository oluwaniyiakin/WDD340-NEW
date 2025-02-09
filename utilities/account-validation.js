const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const utilities = require("../utilities");

const validate = {};

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => [
  body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a first name."),

  body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a last name."),

  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if (emailExists) {
        throw new Error("Email already exists. Please log in or use a different email.");
      }
    }),

  body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 12 characters long and include uppercase, lowercase, a number, and a symbol."),
];

/* **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => [
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required."),

  body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required."),
];

/* **********************************
 *  Account Update Validation Rules
 * ********************************* */
validate.updateAccountRules = () => [
  body("first_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name is required."),

  body("last_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name is required."),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required."),
];

/* **********************************
 *  Password Update Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => [
  body("password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 12 characters long and include uppercase, lowercase, a number, and a symbol."),
];

/* ******************************
 *  Check Registration Data and Return Errors
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/register", {
      errors: errors.array(),
      title: "Register",
      nav,
      ...req.body, // Keep form data sticky
    });
  }
  next();
};

/* ******************************
 *  Check Login Data and Return Errors
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      ...req.body, // Keep form data sticky
    });
  }
  next();
};

/* ******************************
 *  Check Account Update Data and Return Errors
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/update", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      ...req.body, // Keep form data sticky
    });
  }
  next();
};

/* ******************************
 *  Check Password Update Data and Return Errors
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", "Password update failed. Please follow security requirements.");
    return res.redirect("/account/update");
  }
  next();
};

/* **********************************
 *  Export Validation Functions
 * ********************************* */
module.exports = validate;
