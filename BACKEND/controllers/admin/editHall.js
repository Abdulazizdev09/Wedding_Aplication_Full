const pool = require("../../config/db");

exports.editHall = async (req, res) => {
  try {
    const hallId = req.params.hall_id;
    const { name, region, capacity, price_per_seat, status, owner_id, phone_number } = req.body;

    const hall = await pool.query(`SELECT * FROM WEDDING_HALLS WHERE id = $1`, [hallId]);
    if (hall.rows.length === 0) {
      return res.status(404).json({ message: "❌ Hall not found ❌" });
    }

    await pool.query(`
      UPDATE WEDDING_HALLS 
      SET name = $1, region = $2, capacity = $3, price_per_seat = $4, status = $5, owner_id = $6,phone_number = $7
      WHERE id = $8
    `, [name, region, capacity, price_per_seat, status, owner_id, phone_number, hallId]);

    res.status(200).json({ message: "✅ Hall updated successfully ✅" });
  } catch (error) {
    console.error("Admin Edit Error:", error.message);
    res.status(500).json({ message: "❌ Internal Server Error ❌" });
  }
};
