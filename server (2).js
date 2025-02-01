// server.js
const express = require('express');
const path = require('path');
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
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

// Home Route
app.get('/', (req, res) => {
  res.render('index', { title: 'CSE Motors', vehicles });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
