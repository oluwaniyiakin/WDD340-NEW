// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs'); // For reading JSON file

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000; // Default to 10000 if environment variable is not set

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

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

// Route handler for the vehicle detail view
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

// Route handler for the about page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us - CSE Motors' });
});

// Route handler for the contact page
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us - CSE Motors' });
});

// Handle 404 errors (Page not found)
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
