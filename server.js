const app = require("./app"); // Import app.js
const pool = require("./database/"); // Database connection
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const errorMiddleware = require("./utilities/errorMiddleware");
const accountRoutes = require("./routes/accountRoute");
const errorRoutes = require("./routes/errorRoute");

const PORT = process.env.PORT || 10000;

// Session Middleware
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || "yourSecretKeyHere",
  resave: false,
  saveUninitialized: true,
  name: "sessionId",
}));

// Flash messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

// Routes
app.use("/account", accountRoutes);
app.use("/error", errorRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.render("index", { title: "Home - CSE Motors", vehicles: result.rows });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render("errors/500", { title: "500 - Server Error", message: error.message });
  }
});

// Error handling
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "404 - Page Not Found" });
});

app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
