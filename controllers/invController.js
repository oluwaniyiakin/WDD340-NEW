const inventoryModel = require('../models/inventory-model');

function vehicleDetail(req, res, next) {
  const vehicle = inventoryModel.getVehicleById(req.params.id);

  if (!vehicle) {
    return res.status(404).render('404', { title: 'Vehicle Not Found' });
  }

  res.render('inventory/detail', {
    title: `${vehicle.year} ${vehicle.name} - CSE Motors`,
    vehicle
  });
}

module.exports = { vehicleDetail };
