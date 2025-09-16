const pool = require("../../config/db");

exports.deleteHall = async (req, res) => {
    try {
        const hallId = req.params.hall_id;

        const hall = await pool.query(`SELECT * FROM WEDDING_HALLS WHERE id = $1`, [hallId]);
        if (hall.rows.length === 0) {
            return res.status(404).json({ message: "❌ Hall not found ❌" });
        }

        await pool.query(`DELETE FROM WEDDING_HALLS WHERE id = $1`, [hallId]);
        res.status(200).json({ message: "✅ Hall deleted by admin ✅" });
    } catch (error) {
        console.error("Admin Delete Error:", error.message);
        res.status(500).json({ message: "❌ Internal Server Error ❌" });
    }
};
