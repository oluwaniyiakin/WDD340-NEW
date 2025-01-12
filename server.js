// Import required modules
const express = require('express');
const path = require('path');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Example Routes
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home - CSE Motors' });
});

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: '404 - Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
