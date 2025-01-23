// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;

// Mock utility function for navigation bar
const utilities = {
  getNav: async () => [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
  ],
};

// Mock data for vehicles
const vehicles = [
  { name: 'Adventador', image: 'adventador.JPG', description: 'Luxury at its finest.' },
  { name: 'AeroCar', image: 'aerocar.JPG', description: 'A blend of car and plane!' },
  { name: 'Batmobile', image: 'batmobile.JPG', description: 'Justice delivered in style.' },
  { name: 'Camaro', image: 'camaro.JPG', description: 'Muscle and power combined.' },
  { name: 'Crown Victoria', image: 'crwn-vic.JPG', description: 'Classic style.' },
  { name: 'Delorean', image: 'delorean.JPG', description: 'Travel back to the future.' },
  { name: 'Dog Car', image: 'dog-car.JPG', description: 'Quirky and fun transportation.' },
  { name: 'Escalade', image: 'escalade.JPG', description: 'The essence of luxury SUVs.' },
  { name: 'Fire Truck', image: 'fire-truck.JPG', description: 'For heroes in action.' },
  { name: 'Hummer', image: 'hummer.JPG', description: 'Bold and strong.' },
  { name: 'Mechanic', image: 'mechanic.JPG', description: 'Ready for service.' },
  { name: 'Model T', image: 'model-t.JPG', description: 'A timeless classic.' },
  { name: 'Monster Truck', image: 'monster-truck.JPG', description: 'Big wheels for big fun.' },
  { name: 'Mystery Van', image: 'mystery-van.JPG', description: 'Uncovering secrets on the road.' },
  { name: 'Survan', image: 'survan.JPG', description: 'Spacious and family-friendly.' },
  { name: 'Wrangler', image: 'wrangler.JPG', description: 'Off-road adventures await.' },
];

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // To serve static files like images and CSS

// Route for Home page
app.get('/', async (req, res) => {
  try {
    // Fetch navigation data
    const nav = await utilities.getNav();

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
    console.error(`Error at "${req.originalUrl}": ${err.message}`);
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
