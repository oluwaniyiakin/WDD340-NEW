// Import required modules
const express = require('express');
const path = require('path');

// Initialize the app
const app = express();

// Set the port
const PORT = 5500;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static('public')); // Serve the public folder

// Route handler for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Handle 404 errors (Page not found)
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
