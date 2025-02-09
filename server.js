// Import required modules
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./database/"); // Database connection
const errorMiddleware = require("./utilities/errorMiddleware"); // Error handling middleware
const utilities = require("./utilities");

// Import Routes
const accountRoutes = require("./routes/accountRoute");
const errorRoutes = require("./routes/errorRoute");
const inventoryRoutes = require("./routes/inventoryRoute");

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000;

// Ensure JWT Secret is defined
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing JWT_SECRET in environment variables.");
  process.exit(1);
}
console.log("✅ JWT Secret Loaded");

// Middleware to check JWT tokens
app.use((req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user info
    }
  } catch (error) {
    console.warn("⚠️ JWT Verification Failed:", error.message);
  }
  next();
});

// Middleware Setup
app.use(cookieParser());
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "yourSecretKeyHere",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
    cookie: { secure: false }, // Set to true in production
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Set EJS as the templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware for parsing requests
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/account", accountRoutes);
app.use("/error", errorRoutes);
app.use("/inv", inventoryRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.render("index", { title: "Home - CSE Motors", vehicles: result.rows, user: req.user || null });
  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).render("errors/500", { title: "500 - Server Error", message: error.message });
  }
});

// Vehicle Details Route
app.get("/inventory/detail/:id", async (req, res) => {
  const vehicleId = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicleId]);
    if (result.rows.length > 0) {
      res.render("inventory/detail", { title: `${result.rows[0].name} - CSE Motors`, vehicle: result.rows[0], user: req.user || null });
    } else {
      res.status(404).render("errors/404", { title: "404 - Vehicle Not Found" });
    }
  } catch (error) {
    console.error("❌ Error Fetching Vehicle Details:", error);
    res.status(500).render("errors/500", { title: "500 - Server Error", message: error.message });
  }
});

// Additional Pages
app.get("/about", (req, res) => res.render("about", { title: "About Us - CSE Motors" }));
app.get("/contact", (req, res) => res.render("contact", { title: "Contact Us - CSE Motors" }));

// Error Handling
app.use((req, res) => res.status(404).render("errors/404", { title: "404 - Page Not Found" }));
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
