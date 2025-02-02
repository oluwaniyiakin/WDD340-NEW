const fs = require("fs").promises;
const path = require("path");

const vehiclesFilePath = path.join(__dirname, "../Data/vehicles.json");

async function getAllVehicles() {
    const data = await fs.readFile(vehiclesFilePath, "utf8");
    return JSON.parse(data);
}

async function getVehicleById(id) {
    const vehicles = await getAllVehicles();
    return vehicles.find(vehicle => vehicle.id === parseInt(id));
}

module.exports = { getAllVehicles, getVehicleById };
