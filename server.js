// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;

// Import the vehicle model to fetch vehicle data
const Vehicle = require('./models/inventory-model');

// Mock utility function for navigation bar (Updated to return an array of objects)
const utilities = {
  getNav: async () => [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
  ],
};

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // To serve static files like images and CSS

// Route for Home page
app.get('/', async (req, res) => {
  try {
    // Fetch navigation and vehicle data
    const nav = await utilities.getNav();
    const vehicles = await Vehicle.findAll(); // Assuming Vehicle.findAll() fetches all vehicles

    // Render the index.ejs page, passing title, nav, and vehicles data
    res.render('index', {
      title: 'Homepage - CSE Motors',
      nav,
      vehicles,
    });
  } catch (err) {
    console.error('Error fetching home page data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for About page
app.get('/about', async (req, res) => {
  try {
    const nav = await utilities.getNav();
    res.render('about', { title: 'About Us - CSE Motors', nav });
  } catch (err) {
    console.error('Error loading about page:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for Contact page
app.get('/contact', async (req, res) => {
  try {
    const nav = await utilities.getNav();
    res.render('contact', { title: 'Contact Us - CSE Motors', nav });
  } catch (err) {
    console.error('Error loading contact page:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  const err = { status: 404, message: 'Sorry, we appear to have lost that page.' };
  next(err);
});

// Error-handling middleware (must be placed after all routes/middleware)
app.use(async (err, req, res, next) => {
  try {
    const nav = await utilities.getNav();
    // Log the error for debugging
    console.error(`Error at "${req.originalUrl}": ${err.message}`);
    
    // Render the error page with an appropriate message
    res.status(err.status || 500).render('errors/error', {
      title: err.status === 404 ? 'Page Not Found' : 'Server Error',
      message: err.message || 'An unexpected error occurred. Please try again later.',
      nav,
    });
  } catch (err) {
    console.error('Error handling middleware failed:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
