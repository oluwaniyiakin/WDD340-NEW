const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

/* ****************************************
 *  Deliver Login View
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", { title: "Login", nav });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver Registration View
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", { title: "Register", nav, errors: null });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/management", { title: "Account Management", nav });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Hash the password securely
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);

    if (regResult) {
      req.flash("success", `Welcome, ${account_firstname}! Please log in.`);
      return res.redirect("/account/login");
    }
  } catch (error) {
    req.flash("error", "An error occurred during registration.");
    return res.status(500).render("account/register", { title: "Register", nav, errors: null });
  }
}

/* ****************************************
 *  Process Login
 * *************************************** */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData || !(await bcrypt.compare(account_password, accountData.account_password))) {
      req.flash("error", "Invalid email or password.");
      return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email });
    }

    // Remove password from response for security
    delete accountData.account_password;

    // Generate JWT token
    const token = jwt.sign(accountData, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000, // 1 hour
    });

    req.flash("success", `Welcome back, ${accountData.account_firstname}!`);
    return res.redirect("/account/");
  } catch (error) {
    req.flash("error", "Login failed. Please try again.");
    return res.status(500).render("account/login", { title: "Login", nav, errors: null });
  }
}

/* ****************************************
 *  Deliver Update Account View
 * *************************************** */
async function getUpdateView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account = await accountModel.getAccountById(req.params.id);
    if (!account) {
      req.flash("error", "Account not found.");
      return res.redirect("/account/");
    }
    res.render("account/update", { title: "Update Account", nav, account });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Account Update
 * *************************************** */
async function updateAccount(req, res, next) {
  const { account_id, first_name, last_name, email } = req.body;

  try {
    const result = await accountModel.updateAccount(account_id, first_name, last_name, email);
    if (result) {
      req.flash("success", "Account updated successfully.");
    } else {
      req.flash("error", "Failed to update account.");
    }
    return res.redirect("/account/");
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Password Update
 * *************************************** */
async function updatePassword(req, res, next) {
  const { account_id, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);

    if (result) {
      req.flash("success", "Password changed successfully.");
    } else {
      req.flash("error", "Failed to change password.");
    }
    return res.redirect("/account/");
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Logout
 * *************************************** */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("success", "You have been logged out.");
  res.redirect("/");
}

exports.logout = (req, res) => {
  try {
      // Destroy session if using session-based auth
      req.session.destroy((err) => {
          if (err) {
              console.error("Session destruction error:", err);
              return res.status(500).send("Logout failed.");
          }
      });

      // Clear the JWT cookie
      res.clearCookie("jwt"); // Ensure cookie-parser is used in `server.js`
      
      res.redirect("/"); // Redirect to home page after logout
  } catch (error) {
      console.error("Logout error:", error);
      res.status(500).send("Server error during logout.");
  }
};


/* ****************************************
 *  Export Controllers
 * *************************************** */
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  getUpdateView,
  updateAccount,
  updatePassword,
  logout,
};
