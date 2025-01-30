const getVehicleById = async (id) => {
  const query = "SELECT * FROM inventory WHERE inv_id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0]; // Return single vehicle
};
