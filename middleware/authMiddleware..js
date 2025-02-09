const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure you have a .env file with JWT_SECRET

/**
 * Middleware to check if the user is authenticated
 */
function authenticateToken(req, res, next) {
    const token = req.cookies.jwt; // Retrieve token from cookies
    if (!token) {
        req.flash("error", "Access denied. Please log in.");
        return res.redirect("/account/login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.flash("error", "Invalid or expired session. Please log in again.");
            return res.redirect("/account/login");
        }
        req.user = user; // Store user info in request
        res.locals.user = user; // Make user data available in views
        next();
    });
}

/**
 * Middleware to check if the user is an Employee or Admin
 */
function authorizeAdmin(req, res, next) {
    if (req.user && (req.user.account_type === "Employee" || req.user.account_type === "Admin")) {
        return next();
    }
    req.flash("error", "Access denied. You do not have permission.");
    res.redirect("/account/login");
}

module.exports = { authenticateToken, authorizeAdmin };
