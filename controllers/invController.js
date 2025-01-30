const getVehicleById = async (req, res) => {
  try {
      const vehicleId = req.params.id;
      const vehicle = await inventoryModel.getVehicleById(vehicleId);

      if (!vehicle) {
          return res.status(404).render("error", { message: "Vehicle not found" });
      }

      // Fetch all vehicles for the sidebar
      const vehicles = await inventoryModel.getAllVehicles();

      res.render("detail", { vehicle, vehicles, title: `${vehicle.inv_make} ${vehicle.inv_model}` });
  } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).render("error", { message: "Internal Server Error" });
  }
};
