const pool = require("../../config/db");

exports.editHall = async (req, res) => {
  try {
    const hallId = req.params.hall_id;
    const ownerId = req.user.id;
    const { name, region, capacity, price_per_seat, phone_number } = req.body;

    const hall = await pool.query(
      `SELECT * FROM WEDDING_HALLS WHERE id = $1 AND owner_id = $2`,
      [hallId, ownerId]
    );

    if (hall.rows.length === 0) {
      return res.status(403).json({ message: "❌ You can't edit this hall ❌" });
    }

    await pool.query(`
      UPDATE WEDDING_HALLS 
      SET name = $1, region = $2, capacity = $3, price_per_seat = $4, phone_number = $5
      WHERE id = $6
    `, [name, region, capacity, price_per_seat, phone_number, hallId]);

    res.status(200).json({ message: "✅ Hall updated by owner ✅" });
  } catch (error) {
    console.error("Owner Edit Error:", error.message);
    res.status(500).json({ message: "❌ Internal Server Error ❌" });
  }
};