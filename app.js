

module.exports = app;
const express = require('express');
const path = require('path');
const vehiclesRoute = require('./routes/vehicles');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use vehicles route
app.use('/vehicles', vehiclesRoute);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
