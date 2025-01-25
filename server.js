// Import required modules
const express = require('express');
const path = require('path');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 10000; // Default to 10000 if environment variable is not set

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Vehicles Array (Mock Data)
const vehicles = [
  { id: 1, name: 'Adventador', image: 'adventador.jpg', year: 2019, price: 75000, mileage: 25000, description: 'High-performance luxury sports car' },
  { id: 2, name: 'Aerocar', image: 'aerocar.jpg', year: 2021, price: 100000, mileage: 1000, description: 'Futuristic flying car with the latest tech' },
  { id: 3, name: 'Batmobile', image: 'batmobile.jpg', year: 2018, price: 120000, mileage: 5000, description: 'The ultimate vehicle for crime-fighting and stealth' },
  { id: 4, name: 'Camaro', image: 'camaro.jpg', year: 2020, price: 30000, mileage: 20000, description: 'Classic muscle car with modern performance' },
];

// Route handler for the home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home - CSE Motors', vehicles }); // Pass vehicles and dynamic title
});

// Route handler for the vehicle detail view
app.get('/inventory/detail/:id', (req, res) => {
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
