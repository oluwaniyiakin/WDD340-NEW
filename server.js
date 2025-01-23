// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;

// Mock utility function for navigation bar (Updated to return an array of objects)
const utilities = {
  getNav: async () => [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
  ],
};

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON requests
app.use(express.json());

// Route for Home page
app.get('/', async (req, res) => {
  const nav = await utilities.getNav();
  res.render('index', { title: 'Homepage - CSE Motors', nav });
});

// Route for About page
app.get('/about', async (req, res) => {
  const nav = await utilities.getNav();
  res.render('about', { title: 'About Us - CSE Motors', nav });
});

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  const err = { status: 404, message: 'Sorry, we appear to have lost that page.' };
  next(err);
});

// Error-handling middleware (must be placed after all routes/middleware)
app.use(async (err, req, res, next) => {
  // Fetch navigation links for error pages
  const nav = await utilities.getNav();
  
  // Log the error for debugging
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  
  // Render the error page with a message
  res.status(err.status || 500).render('error', {
    title: err.status === 404 ? 'Page Not Found' : 'Server Error',
    message: err.message || 'An unexpected error occurred. Please try again later.',
    nav,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
