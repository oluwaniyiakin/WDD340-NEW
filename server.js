// Import required modules
const express = require('express');
const path = require('path');

// Initialize the app
const app = express();

// Set the port
const PORT = process.env.PORT || 5500; // Use environment variable or default to 5500

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Vehicles Array (Mock Data)
const vehicles = [
  { name: "Adventador", image: "adventador.jpg" },
  { name: "Aerocar", image: "aerocar.jpg" },
  { name: "Batmobile", image: "batmobile.jpg" },
  { name: "Camaro", image: "camaro.jpg" },
  { name: "Crown Vic", image: "crwn-vic.jpg" },
  { name: "Delorean", image: "delorean.jpg" },
  { name: "Dog Car", image: "dog-car.jpg" },
  { name: "Escalade", image: "escalade.jpg" },
  { name: "Fire Truck", image: "fire-truck.jpg" },
  { name: "Hummer", image: "hummer.jpg" },
  { name: "Mechanic", image: "mechanic.jpg" },
  { name: "Model T", image: "model-t.jpg" },
  { name: "Monster Truck", image: "monster-truck.jpg" },
  { name: "Mystery Van", image: "mystery-van.jpg" },
  { name: "Wrangler", image: "wrangler.jpg" },
];

// Route handler for the home page
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home - CSE Motors', vehicles }); // Pass vehicles and dynamic title
});

// Additional routes (e.g., About, Contact) for scalability
app.get('/about', (req, res) => {
  res.render('about', { pageTitle: 'About Us - CSE Motors' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { pageTitle: 'Contact Us - CSE Motors' });
});

// Handle 404 errors (Page not found)
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: '404 - Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
