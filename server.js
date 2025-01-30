// Import required modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const pool = require("./database/"); // Database connection
const errorRoutes = require("./routes/errorRoute"); // Custom error route
const errorMiddleware = require("./utilities/errorMiddleware"); // Error handling middleware

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000; // Default to 10000 if not set

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ***********************
 * Middleware
 * ************************/
app.use(express.static(path.join(__dirname, "public")));  // Serve static files (CSS, JS, images, etc.)
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Session handling with PostgreSQL store
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,  // The pool object for database connection
    }),
    secret: process.env.SESSION_SECRET || "yourSecretKeyHere", // Make sure you use a proper secret
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
);

/* ***********************
 * Route Handlers
 * ************************/

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
      res.render("inventory/detail", {
        title: `${result.rows[0].name} - CSE Motors`,
        vehicle: result.rows[0],
      });
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

// Register the error route
app.use("/error", errorRoutes);

// Handle 404 errors (Page not found)
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "404 - Page Not Found" });
});

// Middleware to handle server errors (500) - should be the last middleware
app.use(errorMiddleware); // Assuming your custom errorMiddleware properly handles errors

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
