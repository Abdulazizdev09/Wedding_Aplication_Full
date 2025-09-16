const pool = require("../../config/db");

exports.getHalls = async (req, res) => {
  try {
    const owner_id = parseInt(req.user?.id, 10);
    if (isNaN(owner_id) || owner_id <= 0) {
      return res.status(401).json({ message: "Invalid or missing user ID" });
    }

    const result = await pool.query(`
      SELECT 
        h.id,
        h.name,
        h.region,
        h.capacity,
        h.price_per_seat,
        h.status,
        h.phone_number,
        i.image_path
      FROM wedding_halls h
      LEFT JOIN hall_images i
        ON h.id = i.hall_id AND i.is_main = true
      WHERE h.owner_id = $1
    `, [owner_id]);

    res.status(200).json({
      message: result.rows.length === 0 ? "No halls found for this owner" : "Halls retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching owner halls:", error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};