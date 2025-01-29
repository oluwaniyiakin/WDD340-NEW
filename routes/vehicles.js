const fs = require('fs');
const path = require('path');

const vehiclesFilePath = path.join(__dirname, '../Data/vehicles.json');

function getVehicleById(id) {
  const vehiclesData = JSON.parse(fs.readFileSync(vehiclesFilePath, 'utf8'));
  return vehiclesData.find(vehicle => vehicle.id === parseInt(id));
}

module.exports = { getVehicleById };
