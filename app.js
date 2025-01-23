// Import required modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { render404, render500 } = require('./middlewares/errorHandlers');

// Initialize Express app
const app = express();

// Use helmet for security
app.use(helmet());

// Setup middleware
app.use(morgan('dev')); // Logging
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import and mount routes
const inventoryRoutes = require('./routes/inventoryRoute');
const mainRoutes = require('./routes/mainRoute');
app.use('/', mainRoutes);
app.use('/inventory', inventoryRoutes);

// Catch 404 errors and forward to error handler
app.use(render404);

// Error handling middleware
app.use(render500);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
