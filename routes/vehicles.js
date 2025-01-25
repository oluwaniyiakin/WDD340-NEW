const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Helper function to load vehicles
const loadVehicles = () => {
  const filePath = path.join(__dirname, '../Data/vehicles.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

// Route: Get all vehicles
router.get('/', (req, res) => {
  const vehicles = loadVehicles();
  res.render('vehicles', { title: 'Vehicles - CSE Motors', vehicles });
});

// Route: Get details for a single vehicle
router.get('/:id', (req, res) => {
  const vehicles = loadVehicles();
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id, 10));

  if (!vehicle) {
    return res.status(404).render('404', { title: 'Vehicle Not Found' });
  }

  res.render('vehicle-detail', { title: `${vehicle.name} - CSE Motors`, vehicle });
});

module.exports = router;
