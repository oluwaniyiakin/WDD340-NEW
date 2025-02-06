// Import required modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const bcrypt = require("bcryptjs");
const pool = require("./database/"); // Database connection
const errorMiddleware = require("./utilities/errorMiddleware"); // Error handling middleware

// Import Routes
const accountRoutes = require("./routes/accountRoute");
const errorRoutes = require("./routes/errorRoute");
const inventoryRoutes = require("./routes/inventoryRoute"); // Ensuring inventory routes are included



// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000;

/* ***********************
 * Middleware
 * ************************/

// Session Middleware
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true, // Auto-create session table
      pool, // Use PostgreSQL database connection
    }),
    secret: process.env.SESSION_SECRET || "yourSecretKeyHere", // Secure key
    resave: false,
    saveUninitialized: true,
    name: "sessionId", // Custom session cookie name
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Flash Messages Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Correct way to initialize express-messages
  next();
});

// Set EJS as the templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to parse incoming requests
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

/* ***********************
 * Route Handlers
 * ************************/
app.use("/account", accountRoutes); // Account Routes
app.use("/error", errorRoutes); // Custom Error Routes
app.use("/inv", inventoryRoutes); // Added missing inventory routes

// Home Page - Display all vehicles
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.render("index", { title: "Home - CSE Motors", vehicles: result.rows });
  } catch (error) {
    console.error("Database error loading vehicles:", error);
    res.status(500).render("errors/500", { title: "500 - Server Error", message: error.message });
  }
});

// Vehicle Details - Display a single vehicle
app.get("/inventory/detail/:id", async (req, res) => {
  const vehicleId = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicleId]);
    if (result.rows.length > 0) {
      res.render("inventory/detail", { title: `${result.rows[0].name} - CSE Motors`, vehicle: result.rows[0] });
    } else {
      res.status(404).render("errors/404", { title: "404 - Vehicle Not Found" });
    }
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).render("errors/500", { title: "500 - Server Error", message: error.message });
  }
});

// Additional Pages
app.get("/about", (req, res) => {
  res.render("about", { title: "About Us - CSE Motors" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us - CSE Motors" });
});

/* ***********************
 * Error Handling
 * ************************/
// Handle 404 errors (Page not found)
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "404 - Page Not Found" });
});

// Middleware to handle server errors (500)
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
