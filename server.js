// Import required modules
const express = require('express');
const path = require('path');
const session = require("express-session");
const pool = require('./database/'); // Database connection

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000; // Default to 10000 if not set

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ***********************
 * Middleware
 * ************************/
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'yourSecretKeyHere', // Replace with an actual secret
  resave: false,
  saveUninitialized: true,
  name: 'sessionId',
}));

/* ***********************
 * Route Handlers
 * ************************/

// Home Page - Display all vehicles
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id ASC');
    res.render('index', { title: 'Home - CSE Motors', vehicles: result.rows });
  } catch (error) {
    console.error("Database error loading vehicles:", error);
    res.status(500).render('500', { title: '500 - Server Error' });
  }
});

// Vehicle Details - Display a single vehicle
app.get('/inventory/detail/:id', async (req, res) => {
  const vehicleId = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
    
    if (result.rows.length > 0) {
      res.render('inventory/detail', { 
        title: `${result.rows[0].name} - CSE Motors`, 
        vehicle: result.rows[0] 
      });
    } else {
      res.status(404).render('404', { title: '404 - Vehicle Not Found' });
    }
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).render('500', { title: '500 - Server Error' });
  }
});

// Additional Pages
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us - CSE Motors' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us - CSE Motors' });
});

// Simulate a 500 error
app.get('/error', (req, res, next) => {
  next(new Error('This is a test 500 error.'));
});

/* ***********************
 * Error Handling Middleware
 * ************************/

// Handle 404 errors (Page not found)
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

// Middleware to handle server errors (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: '500 - Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
