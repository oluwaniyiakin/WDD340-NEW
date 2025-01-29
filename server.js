// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs'); // For reading JSON file
const session = require("express-session");
const pool = require('./database/');

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

// Utility function to load vehicles from the JSON file
function loadVehicles() {
  const filePath = path.join(__dirname, 'Data', 'vehicles.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading vehicles.json:', error);
    return [];
  }
}

// Route handler for the home page
app.get('/', (req, res) => {
  const vehicles = loadVehicles();
  res.render('index', { title: 'Home - CSE Motors', vehicles }); // Pass vehicles dynamically
});

// Route handler for vehicle details
app.get('/inventory/detail/:id', (req, res) => {
  const vehicles = loadVehicles();
  const vehicleId = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  if (vehicle) {
    res.render('inventory/detail', {
      title: `${vehicle.name} - CSE Motors`,
      vehicle,
    });
  } else {
    res.status(404).render('404', { title: '404 - Vehicle Not Found' });
  }
});

// Route handlers for additional pages
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
