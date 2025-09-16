const pool = require("../../config/db");

exports.getHalls = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        h.id,
        h.name,
        h.region,
        h.capacity,
        h.price_per_seat,
        h.status,
        h.owner_id,
        h.phone_number,
        i.image_path
      FROM wedding_halls h
      LEFT JOIN hall_images i ON h.id = i.hall_id AND i.is_main = true
    `);

    res.status(200).json({
      message: result.rows.length === 0 ? "No wedding halls found" : "Wedding halls retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error getting halls:", error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};